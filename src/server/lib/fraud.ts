import crypto from "node:crypto";
import type { Types } from "mongoose";
import { z } from "zod";
import { checkCourier, checkReviews } from "@/server/functions/service.fn";
import { expireSubscriptions } from "@/server/lib/subscription";
import { CourierCheck } from "@/server/models/courierData.model";
import { SearchUsage } from "@/server/models/searchUsage.model";
import { userSubscription } from "@/server/models/subscription.model";
import { User } from "@/server/models/user.model";

export const PENDING_RESERVATION_TTL_MS = 10 * 60 * 1000;

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
	userId: Types.ObjectId,
	subscriptionId: Types.ObjectId,
) {
	try {
		await SearchUsage.create({ userId, subscriptionId });
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

		// If a very slow request outlived the stale-reservation cleanup, the
		// search still succeeded and must count against the quota.
		if (settled.modifiedCount === 0) {
			const fallback = await userSubscription.updateOne(
				{ _id: subscriptionId },
				{ $inc: { api_calls_used: 1 } },
			);
			if (fallback.matchedCount === 0) {
				throw new Error("Subscription usage could not be recorded");
			}
		}
	} catch {
		throw new FraudError(
			"USAGE_ACCOUNTING_FAILED",
			"The search completed, but usage could not be recorded",
			503,
		);
	}
}

/**
 * Validate the authenticated user, reserve one subscription call, and only
 * then call the shared courier provider service. A failed provider request
 * releases the reserved call so users are not charged for failed requests.
 * Every search — cached or fresh — reserves and settles one quota unit.
 * Previously checked numbers are served from the CourierCheck cache so
 * repeat lookups never call the external providers.
 *
 * This module lives outside any `createServerFn` on purpose: nothing in it may
 * be referenced by client-reachable top-level code. If `executeFraudCheck`
 * were exported from a `.fn.ts` module (kept alive client-side), the whole
 * mongoose graph would leak into the client bundle and crash the browser.
 */
export async function executeFraudCheck(userId: string, phone: unknown) {
	const parsed = phoneSchema.safeParse({ phone });
	if (!parsed.success) {
		throw new FraudError(
			"INVALID_PHONE",
			parsed.error.issues[0]?.message ?? "Invalid phone number",
			400,
		);
	}

	await expireSubscriptions();

	const user = await User.findById(userId).select("_id isActive").lean();
	if (!user?.isActive) {
		throw new FraudError("INVALID_USER", "Invalid or inactive user", 401);
	}

	const activeSubscription = await userSubscription
		.findOne({
			userId: user._id,
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

	await userSubscription.updateOne(
		{
			_id: activeSubscription._id,
			$or: [
				{ api_calls_pending: { $exists: false } },
				{ api_calls_pending: null },
			],
		},
		{ $set: { api_calls_pending: [] } },
	);

	await userSubscription.updateOne(
		{ _id: activeSubscription._id },
		{
			$pull: {
				api_calls_pending: { createdAt: { $lt: staleBefore } },
			},
		},
	);

	const reservedSubscription = await userSubscription
		.findOneAndUpdate(
			{
				_id: activeSubscription._id,
				status: "active",
				end_date: { $gt: reservationTime },
				$expr: {
					$lt: [
						{
							$add: [
								"$api_calls_used",
								{
									$size: { $ifNull: ["$api_calls_pending", []] },
								},
							],
						},
						"$packageSnapshot.api_call_limit",
					],
				},
			},
			{
				$push: {
					api_calls_pending: {
						id: reservationId,
						createdAt: reservationTime,
					},
				},
			},
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
	// calling the external providers.
	const cached = await CourierCheck.findOne({
		phone: parsed.data.phone,
	}).lean();
	if (cached?.data && Object.keys(cached.data).length > 0) {
		await settleReservation(reservedSubscription._id, reservationId);
		await recordSearchUsage(user._id, reservedSubscription._id);
		return { ...cached.data, reviews: cached.reports ?? [] };
	}

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

	await settleReservation(reservedSubscription._id, reservationId);
	await recordSearchUsage(user._id, reservedSubscription._id);

	// Optional enrichment: the reviews lookup resolves to an empty array on any
	// failure, so it can never affect the successful courier check result.
	const reviews = await checkReviews(parsed.data.phone);
	const courierData = (result ?? {}) as Record<string, unknown>;

	// Best-effort cache: a storage failure must never fail the request.
	try {
		await CourierCheck.updateOne(
			{ phone: parsed.data.phone },
			{ $set: { data: courierData, reports: reviews } },
			{ upsert: true },
		);
	} catch (error) {
		console.error("Courier data could not be cached:", error);
	}

	return { ...courierData, reviews };
}
