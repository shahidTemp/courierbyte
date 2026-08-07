import { createServerFn } from "@tanstack/react-start";
import { expireSubscriptions } from "@/server/lib/subscription";
import { authMiddleware, requireRole } from "@/server/middleware";
import { SearchUsage } from "@/server/models/searchUsage.model";
import { userSubscription } from "@/server/models/subscription.model";
import { User } from "@/server/models/user.model";

const BANGLADESH_TIME_ZONE = "Asia/Dhaka";
const DAY_MS = 24 * 60 * 60 * 1000;

function getBangladeshDateParts(now = new Date()) {
	const dateFormatter = new Intl.DateTimeFormat("en-CA", {
		timeZone: BANGLADESH_TIME_ZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
	const parts = dateFormatter.formatToParts(now);
	return Object.fromEntries(
		parts
			.filter(({ type }) => type !== "literal")
			.map(({ type, value }) => [type, value]),
	) as { year: string; month: string; day: string };
}

function getDhakaMidnight(year: number, month: number, day: number) {
	return new Date(
		`${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T00:00:00+06:00`,
	);
}

function getBangladeshMonthBounds(now = new Date()) {
	const { year, month } = getBangladeshDateParts(now);
	const currentYear = Number(year);
	const currentMonth = Number(month);
	const currentMonthStart = getDhakaMidnight(currentYear, currentMonth, 1);
	const previousMonthStart =
		currentMonth === 1
			? getDhakaMidnight(currentYear - 1, 12, 1)
			: getDhakaMidnight(currentYear, currentMonth - 1, 1);

	return { currentMonthStart, previousMonthStart };
}

function getBangladeshDayBounds(now = new Date()) {
	const dateParts = getBangladeshDateParts(now);
	const dayStart = getDhakaMidnight(
		Number(dateParts.year),
		Number(dateParts.month),
		Number(dateParts.day),
	);
	const nextDayStart = new Date(dayStart.getTime() + DAY_MS);

	return { dayStart, nextDayStart };
}

export const getAdminDashboardStats = createServerFn({ method: "GET" })
	.middleware([requireRole(["admin", "super_admin"])])
	.handler(async () => {
		await expireSubscriptions();

		const now = new Date();
		const { dayStart, nextDayStart } = getBangladeshDayBounds(now);
		const { currentMonthStart, previousMonthStart } =
			getBangladeshMonthBounds(now);
		const newUserThreshold = new Date(dayStart.getTime() - 30 * DAY_MS);
		const trendStart = new Date(dayStart.getTime() - 13 * DAY_MS);
		const activeSubscriberIds = await userSubscription.distinct("userId", {
			status: "active",
			end_date: { $gt: now },
		});

		const [
			totalUsers,
			activeUsers,
			newUsers,
			oldUsers,
			activeSubscribers,
			requestsToday,
			requestsLastMonth,
			requestsCurrentMonth,
			dailyRequests,
		] = await Promise.all([
			User.countDocuments({ role: "user" }),
			User.countDocuments({ role: "user", isActive: true }),
			User.countDocuments({
				role: "user",
				createdAt: { $gte: newUserThreshold },
			}),
			User.countDocuments({
				role: "user",
				createdAt: { $lt: newUserThreshold },
			}),
			activeSubscriberIds.length
				? User.countDocuments({
						role: "user",
						_id: { $in: activeSubscriberIds },
					})
				: 0,
			SearchUsage.countDocuments({
				createdAt: { $gte: dayStart, $lt: nextDayStart },
			}),
			SearchUsage.countDocuments({
				createdAt: { $gte: previousMonthStart, $lt: currentMonthStart },
			}),
			SearchUsage.countDocuments({
				createdAt: { $gte: currentMonthStart, $lt: now },
			}),
			SearchUsage.aggregate([
				{
					$match: {
						createdAt: { $gte: trendStart, $lt: now },
					},
				},
				{
					$group: {
						_id: {
							$dateToString: {
								format: "%Y-%m-%d",
								date: "$createdAt",
								timezone: BANGLADESH_TIME_ZONE,
							},
						},
						requests: { $sum: 1 },
					},
				},
				{ $sort: { _id: 1 } },
			]),
		]);

		return JSON.parse(
			JSON.stringify({
				generatedAt: now,
				users: {
					total: totalUsers,
					active: activeUsers,
					new: newUsers,
					old: oldUsers,
				},
				activeSubscribers,
				requests: {
					today: requestsToday,
					lastMonth: requestsLastMonth,
					currentMonth: requestsCurrentMonth,
				},
				dailyRequests: dailyRequests.map((item) => ({
					date: item._id,
					requests: item.requests,
				})),
			}),
		);
	});

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
