import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware, requireRole } from "@/server/middleware";
import { PackageModel } from "@/server/models/package.model";
import { userSubscription } from "@/server/models/subscription.model";

const createSubscriptionSchema = z.object({
	packageId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid package ID"),
	planType: z.enum(["monthly", "yearly"]),
	transactionId: z.string().trim().min(1, "Transaction ID is required"),
	senderNumber: z.string().trim().min(1, "Sender number is required"),
	amount: z.number().finite().min(0),
});

export const getAllSubscriptions = createServerFn({ method: "GET" })
	.middleware([requireRole(["admin", "super_admin"])])
	.handler(async () => {
		const subscriptions = await userSubscription
			.find()
			.populate("userId", "name number")
			.sort({ createdAt: -1 })
			.lean();

		return JSON.parse(JSON.stringify(subscriptions));
	});

const updateStatusSchema = z.object({
	id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid subscription ID"),
	status: z.enum(["pending", "active", "expired", "cancelled"]),
});

export const updateSubscriptionStatus = createServerFn({ method: "POST" })
	.middleware([requireRole(["admin", "super_admin"])])
	.validator(updateStatusSchema)
	.handler(async ({ data, context }) => {
		const update = {
			status: data.status,
			...(data.status === "active" ? { verifiedBy: context.actor._id } : {}),
		};

		const subscription = await userSubscription
			.findByIdAndUpdate(data.id, update, { new: true, runValidators: true })
			.lean();

		if (!subscription) throw new Error("Subscription not found");

		if (data.status === "active") {
			await userSubscription.updateMany(
				{
					_id: { $ne: subscription._id },
					userId: subscription.userId,
					status: { $in: ["pending", "active"] },
				},
				{ $set: { status: "cancelled" } },
			);
		}

		return JSON.parse(JSON.stringify(subscription));
	});

export const getMySubscriptions = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		const subscriptions = await userSubscription
			.find({ userId: context.actor._id })
			.sort({ createdAt: -1 })
			.lean();

		const priority = { active: 0, pending: 1, expired: 2, cancelled: 3 };
		const sorted = subscriptions.sort(
			(a, b) =>
				priority[a.status as keyof typeof priority] -
				priority[b.status as keyof typeof priority],
		);

		return JSON.parse(JSON.stringify(sorted));
	});

export const createSubscription = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(createSubscriptionSchema)
	.handler(async ({ data, context }) => {
		const existing = await userSubscription.findOne({
			userId: context.actor._id,
			status: "active",
		});
		if (existing) {
			throw new Error("আপনার ইতিমধ্যে একটি সক্রিয় সাবস্ক্রিপশন আছে");
		}

		const packageItem = await PackageModel.findOne({
			_id: data.packageId,
			is_active: true,
		});
		if (!packageItem) {
			throw new Error("প্যাকেজটি খুঁজে পাওয়া যায়নি");
		}

		const expectedAmount =
			data.planType === "yearly"
				? packageItem.yearly_price
				: packageItem.price;
		if (data.amount !== expectedAmount) {
			throw new Error("পেমেন্টের পরিমাণ প্যাকেজ মূল্যের সাথে মেলে না");
		}

		const endDate = new Date(
			Date.now() + packageItem.duration_in_days * 24 * 60 * 60 * 1000,
		);

		try {
			const subscription = await userSubscription.create({
				userId: context.actor._id,
				packageId: packageItem._id,
				packageSnapshot: {
					name: packageItem.name,
					price: packageItem.price,
					api_call_limit: packageItem.api_call_limit,
				},
				planType: data.planType,
				status: "pending",
				paid_amount: data.amount,
				end_date: endDate,
				payment: {
					transactionId: data.transactionId,
					senderNumber: data.senderNumber,
				},
			});

			return JSON.parse(JSON.stringify(subscription.toObject()));
		} catch (error) {
			if (
				error &&
				typeof error === "object" &&
				"code" in error &&
				error.code === 11000
			) {
				throw new Error("এই Transaction ID ইতিমধ্যে ব্যবহার করা হয়েছে");
			}
			throw error;
		}
	});
