import crypto from "node:crypto";
import { Types } from "mongoose";
import { z } from "zod";
import { checkCourier, checkReviews } from "@/server/functions/service.fn";
import { PENDING_RESERVATION_TTL_MS } from "@/server/lib/constants";
import { getCachedCheck, setCachedCheck } from "@/server/lib/courierCache";
import { CourierCheck } from "@/server/models/courierData.model";
import { SearchUsage } from "@/server/models/searchUsage.model";
import { userSubscription } from "@/server/models/subscription.model";

/** Cached courier results older than this are served stale and refreshed in the background. */
const CACHE_STALE_AFTER_MS = 90 * 24 * 60 * 60 * 1000;

/** Phone numbers whose background refresh is already in flight. */
const refreshing = new Set<string>();

export const phoneSchema = z.object({
	phone: z
		.string()
		.regex(/^01[3-9]\d{8}$/, "A valid 11-digit phone number is required"),
});

export type FraudErrorCode =
	| "INVALID_PHONE"
	| "INVALID_USER"
	| "NO_ACTIVE_SUBSCRIPTION"
	| "API_LIMIT_REACHED"
	| "COURIER_UNAVAILABLE"
	| "USAGE_ACCOUNTING_FAILED";

export class FraudError extends Error {
	readonly code: FraudErrorCode;
	readonly status: 400 | 401 | 403 | 429 | 503;

	constructor(
		code: FraudErrorCode,
		message: string,
		status: 400 | 401 | 403 | 429 | 503,
		options?: ErrorOptions,
	) {
		super(message, options);
		this.name = "FraudError";
		this.code = code;
		this.status = status;
	}
}

/** Best-effort log of a paid search; a logging failure must not break the check. */
async function recordSearchUsage(
	userId: string,
	subscriptionId: Types.ObjectId,
) {
	try {
		await SearchUsage.create({
			userId: new Types.ObjectId(userId),
			subscriptionId,
		});
	} catch (error) {
		console.error("Search usage event could not be recorded:", error);
	}
}

/**
 * Finalize a reserved call: release the reservation slot and charge the quota.
 * Throws USAGE_ACCOUNTING_FAILED if the charge could not be recorded.
 */
async function settleReservation(
	subscriptionId: Types.ObjectId,
	reservationId: string,
) {
	try {
		const settled = await userSubscription.updateOne(
			{ _id: subscriptionId, "api_calls_pending.id": reservationId },
			{
				$pull: { api_calls_pending: { id: reservationId } },
				$inc: { api_calls_used: 1 },
			},
		);

		// A missing reservation means cleanup already removed it or this
		// completion was already settled. Do not guess by incrementing usage:
		// a retry could otherwise charge the same request more than once.
		if (settled.modifiedCount === 0) {
			throw new Error("Reservation is no longer available for settlement");
		}
	} catch {
		throw new FraudError(
			"USAGE_ACCOUNTING_FAILED",
			"The search completed, but usage could not be recorded",
			503,
		);
	}
}

type CachedResult = {
	data: Record<string, unknown>;
	reports: unknown[];
	isStale: boolean;
};

/** Best-effort write of a check result to both cache tiers. */
async function storeCheckResult(
	phone: string,
	data: Record<string, unknown>,
	reports: unknown[],
) {
	setCachedCheck(phone, data, reports);
	try {
		await CourierCheck.updateOne(
			{ phone },
			{ $set: { data, reports } },
			{ upsert: true },
		);
	} catch (error) {
		console.error("Courier data could not be cached:", error);
	}
}

/**
 * Re-fetch courier data + reviews for a stale cached number and update both
 * cache tiers. Fire-and-forget: failures are logged, never thrown, and the
 * stale data stays until a later attempt succeeds.
 */
async function refreshCachedCheck(phone: string) {
	if (refreshing.has(phone)) return;
	refreshing.add(phone);
	try {
		const data = ((await checkCourier(phone)) ?? {}) as Record<string, unknown>;
		const reports = await checkReviews(phone);
		await storeCheckResult(phone, data, reports);
	} catch (error) {
		console.error(`Courier cache refresh failed for ${phone}:`, error);
	} finally {
		refreshing.delete(phone);
	}
}

/**
 * Validate the authenticated user, reserve one subscription call, and only
 * then call the shared courier provider service. A failed provider request
 * releases the reserved call so users are not charged for failed requests.
 * Every search — cached or fresh — reserves and settles one quota unit.
 * Previously checked numbers are served from the cache (in-memory tier first,
 * then the persisted CourierCheck collection) so repeat lookups never call the
 * external providers. Entries older than 90 days are still served immediately,
 * but a background refresh keeps the next lookup fresh.
 *
 * The caller (auth middleware / API-key lookup) already loaded and verified
 * the user, so only `_id` and `isActive` are passed in — no user document is
 * fetched here. Subscription expiry bookkeeping runs on a background sweep in
 * the Nitro plugin (`src/lib/db.ts`), not on the request path.
 *
 * This module lives outside any `createServerFn` on purpose: nothing in it may
 * be referenced by client-reachable top-level code. If `executeFraudCheck`
 * were exported from a `.fn.ts` module (kept alive client-side), the whole
 * mongoose graph would leak into the client bundle and crash the browser.
 */
export async function executeFraudCheck(
	actor: { _id: string; isActive: boolean },
	phone: unknown,
) {
	const parsed = phoneSchema.safeParse({ phone });
	if (!parsed.success) {
		throw new FraudError(
			"INVALID_PHONE",
			parsed.error.issues[0]?.message ?? "Invalid phone number",
			400,
		);
	}

	if (!actor?.isActive) {
		throw new FraudError("INVALID_USER", "Invalid or inactive user", 401);
	}

	const activeSubscription = await userSubscription
		.findOne({
			userId: actor._id,
			status: "active",
			end_date: { $gt: new Date() },
		})
		.select("_id")
		.lean();

	if (!activeSubscription) {
		throw new FraudError(
			"NO_ACTIVE_SUBSCRIPTION",
			"No active subscription was found",
			403,
		);
	}

	const reservationId = crypto.randomUUID();
	const reservationTime = new Date();
	const staleBefore = new Date(
		reservationTime.getTime() - PENDING_RESERVATION_TTL_MS,
	);

	// Probe the in-memory tier first (sub-millisecond). On a miss, the
	// persisted CourierCheck lookup runs in parallel with the reservation and
	// reports whether the stored result is older than the stale threshold.
	const memCached = getCachedCheck(parsed.data.phone);
	const cachedPromise: Promise<CachedResult | null> = memCached
		? Promise.resolve({ ...memCached, isStale: false })
		: CourierCheck.findOne({ phone: parsed.data.phone })
				.lean()
				.then((doc) => {
					if (!doc?.data || Object.keys(doc.data).length === 0) return null;
					const updatedAt = doc.updatedAt
						? new Date(doc.updatedAt).getTime()
						: 0;
					return {
						data: doc.data,
						reports: doc.reports ?? [],
						isStale: Date.now() - updatedAt >= CACHE_STALE_AFTER_MS,
					};
				})
				// The lookup runs in parallel with the reservation; if the request
				// fails before awaiting it, a rejected query must not become an
				// unhandled rejection (and a transient cache error degrades to a
				// fresh provider call instead of failing the request).
				.catch((error) => {
					console.error("Courier cache lookup failed:", error);
					return null;
				});

	// Reserve one quota unit and sweep stale reservations in a single atomic
	// pipeline update (missing/null pending arrays are handled via $ifNull,
	// so no separate initialization round trip is needed).
	const reservedSubscription = await userSubscription
		.findOneAndUpdate(
			{
				_id: activeSubscription._id,
				status: "active",
				end_date: { $gt: reservationTime },
				// Stale reservations (created before the TTL window) never count
				// against the quota — the update pipeline removes them in the same
				// atomic operation, mirroring the old sweep-before-check semantics.
				$expr: {
					$lt: [
						{
							$add: [
								"$api_calls_used",
								{
									$size: {
										$filter: {
											input: { $ifNull: ["$api_calls_pending", []] },
											as: "pending",
											cond: {
												$gte: ["$$pending.createdAt", staleBefore],
											},
										},
									},
								},
							],
						},
						"$packageSnapshot.api_call_limit",
					],
				},
			},
			[
				{
					$set: {
						api_calls_pending: {
							$concatArrays: [
								{
									$filter: {
										input: { $ifNull: ["$api_calls_pending", []] },
										as: "pending",
										cond: { $gte: ["$$pending.createdAt", staleBefore] },
									},
								},
								[{ id: reservationId, createdAt: reservationTime }],
							],
						},
					},
				},
			],
			{ new: true },
		)
		.select("_id")
		.lean();

	if (!reservedSubscription) {
		throw new FraudError(
			"API_LIMIT_REACHED",
			"API call limit has been reached",
			429,
		);
	}

	// Cache hit: settle the reserved quota and serve the stored result without
	// calling the external providers. A stale result is served immediately
	// while a background refresh re-checks the number for the next lookup.
	const cached = await cachedPromise;
	if (cached) {
		setCachedCheck(parsed.data.phone, cached.data, cached.reports);
		if (cached.isStale) void refreshCachedCheck(parsed.data.phone);
		await Promise.all([
			settleReservation(reservedSubscription._id, reservationId),
			recordSearchUsage(actor._id, reservedSubscription._id),
		]);
		return { ...cached.data, reviews: cached.reports };
	}

	// Reviews are optional enrichment: fetch them in parallel with the courier
	// check, pinned to an empty array so a reviews failure can never fail the
	// request (the courier result is what the customer paid for).
	const reviewsPromise = checkReviews(parsed.data.phone).catch(() => []);

	let result: unknown;
	try {
		result = await checkCourier(parsed.data.phone);
	} catch (error) {
		await userSubscription.updateOne(
			{ _id: reservedSubscription._id, "api_calls_pending.id": reservationId },
			{ $pull: { api_calls_pending: { id: reservationId } } },
		);
		// The generic message is safe for the end user; the original provider
		// error is preserved as the cause for server-side debugging and has
		// already been persisted by checkCourier to the CourierErrorLog.
		throw new FraudError(
			"COURIER_UNAVAILABLE",
			"Courier service is temporarily unavailable",
			503,
			{ cause: error },
		);
	}

	await Promise.all([
		settleReservation(reservedSubscription._id, reservationId),
		recordSearchUsage(actor._id, reservedSubscription._id),
	]);

	const reviews = await reviewsPromise;
	const courierData = (result ?? {}) as Record<string, unknown>;

	// Best-effort cache: a storage failure must never fail the request.
	await storeCheckResult(parsed.data.phone, courierData, reviews);

	return { ...courierData, reviews };
}
