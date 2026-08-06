import { createServerFn } from "@tanstack/react-start";
import { expireSubscriptions } from "@/server/lib/subscription";
import { authMiddleware } from "@/server/middleware";
import { SearchUsage } from "@/server/models/searchUsage.model";
import { userSubscription } from "@/server/models/subscription.model";

const BANGLADESH_TIME_ZONE = "Asia/Dhaka";

function getBangladeshDayBounds(now = new Date()) {
	const dateFormatter = new Intl.DateTimeFormat("en-CA", {
		timeZone: BANGLADESH_TIME_ZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
	const parts = dateFormatter.formatToParts(now);
	const dateParts = Object.fromEntries(
		parts
			.filter(({ type }) => type !== "literal")
			.map(({ type, value }) => [type, value]),
	);
	const localDate = `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
	const dayStart = new Date(`${localDate}T00:00:00+06:00`);
	const nextDayStart = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

	return { dayStart, nextDayStart };
}

export const getDashboardStats = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(async ({ context }) => {
		await expireSubscriptions();
		await userSubscription.updateMany(
			{ userId: context.actor._id },
			{
				$pull: {
					api_calls_pending: {
						createdAt: {
							$lt: new Date(Date.now() - 10 * 60 * 1000),
						},
					},
				},
			},
		);

		const { dayStart, nextDayStart } = getBangladeshDayBounds();
		const [subscriptions, todaySearches] = await Promise.all([
			userSubscription
				.find({ userId: context.actor._id })
				.sort({ createdAt: -1 })
				.lean(),
			SearchUsage.countDocuments({
				userId: context.actor._id,
				createdAt: { $gte: dayStart, $lt: nextDayStart },
			}),
		]);

		const priority = { active: 0, pending: 1, expired: 2, cancelled: 3 };
		const sortedSubscriptions = subscriptions.sort(
			(a, b) =>
				priority[a.status as keyof typeof priority] -
				priority[b.status as keyof typeof priority],
		);
		const activeSubscription = sortedSubscriptions.find(
			(subscription) => subscription.status === "active",
		);

		if (!activeSubscription) {
			return JSON.parse(
				JSON.stringify({
					subscription: null,
					todaySearches,
				}),
			);
		}

		const totalLimit = Math.max(
			0,
			Number(activeSubscription.packageSnapshot?.api_call_limit ?? 0),
		);
		const used = Math.max(0, Number(activeSubscription.api_calls_used ?? 0));
		const pending = activeSubscription.api_calls_pending?.length ?? 0;
		const remaining = Math.max(0, totalLimit - used - pending);
		return JSON.parse(
			JSON.stringify({
				subscription: {
					id: String(activeSubscription._id),
					name: activeSubscription.packageSnapshot?.name ?? "প্যাকেজ",
					planType: activeSubscription.planType,
					status: activeSubscription.status,
					endDate: activeSubscription.end_date,
					totalLimit,
					used,
					pending,
					remaining,
				},
				todaySearches,
			}),
		);
	});
