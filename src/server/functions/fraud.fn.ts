import crypto from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { checkCourier } from "@/server/functions/service.fn";
import { expireSubscriptions } from "@/server/lib/subscription";
import { authMiddleware } from "@/server/middleware";
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
	) {
		super(message);
		this.name = "FraudError";
		this.code = code;
		this.status = status;
	}
}

/**
 * Validate the authenticated user, reserve one subscription call, and only
 * then call the shared courier provider service. A failed provider request
 * releases the reserved call so users are not charged for failed requests.
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

	let result: unknown;
	try {
		result = await checkCourier(parsed.data.phone);
	} catch {
		await userSubscription.updateOne(
			{ _id: reservedSubscription._id, "api_calls_pending.id": reservationId },
			{ $pull: { api_calls_pending: { id: reservationId } } },
		);
		throw new FraudError(
			"COURIER_UNAVAILABLE",
			"Courier service is temporarily unavailable",
			503,
		);
	}

	try {
		const settled = await userSubscription.updateOne(
			{ _id: reservedSubscription._id, "api_calls_pending.id": reservationId },
			{
				$pull: { api_calls_pending: { id: reservationId } },
				$inc: { api_calls_used: 1 },
			},
		);

		// If a very slow request outlived the stale-reservation cleanup, the
		// provider call still succeeded and must count against the quota.
		if (settled.modifiedCount === 0) {
			const fallback = await userSubscription.updateOne(
				{ _id: reservedSubscription._id },
				{ $inc: { api_calls_used: 1 } },
			);
			if (fallback.matchedCount === 0) {
				throw new Error("Subscription usage could not be recorded");
			}
		}
	} catch {
		throw new FraudError(
			"USAGE_ACCOUNTING_FAILED",
			"The courier check completed, but usage could not be recorded",
			503,
		);
	}
	return result;
}

/** Run a fraud check for the currently authenticated panel user. */
export const checkFraud = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(phoneSchema)
	.handler(async ({ data, context }) =>
		executeFraudCheck(String(context.actor._id), data.phone),
	);
