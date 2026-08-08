import { createServerFn } from "@tanstack/react-start";
import { expireSubscriptions } from "@/server/lib/subscription";
import { authMiddleware, requireRole } from "@/server/middleware";
import { CourierCheck } from "@/server/models/courierData.model";
import { CourierErrorLog } from "@/server/models/courierErrorLog.model";
import { CourierKey } from "@/server/models/courierKey.model";
import { SearchUsage } from "@/server/models/searchUsage.model";
import { userSubscription } from "@/server/models/subscription.model";
import { User } from "@/server/models/user.model";

const BANGLADESH_TIME_ZONE = "Asia/Dhaka";
const DAY_MS = 24 * 60 * 60 * 1000;
// Payments count as confirmed revenue once an admin verifies them. Active and
// expired subscriptions both represent money that was actually received;
// "pending" ones are still awaiting verification. "Cancelled" is deliberately
// excluded: it can cover rejected/unverified payments as well as superseded
// plans, so its paid amount is not guaranteed to be confirmed money.
const PAID_STATUSES = ["active", "expired"];

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
		const { year: currentYearStr, month: currentMonthStr } =
			getBangladeshDateParts(now);
		const currentYear = Number(currentYearStr);
		const currentMonth = Number(currentMonthStr);
		const previousMonth =
			currentMonth === 1
				? { year: currentYear - 1, month: 12 }
				: { year: currentYear, month: currentMonth - 1 };
		const currentMonthKey = `${currentYearStr}-${currentMonthStr}`;
		const previousMonthKey = `${previousMonth.year}-${String(previousMonth.month).padStart(2, "0")}`;
		const currentYearStart = getDhakaMidnight(currentYear, 1, 1);
		const sevenDaysAgo = new Date(dayStart.getTime() - 7 * DAY_MS);
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
			dailyRequestRows,
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

		const [
			monthlyRevenueRows,
			pendingRevenueRows,
			activeSubscriptions,
			topPackageRows,
			totalApiCalls,
			apiCallsThisYear,
			totalCourierChecks,
			activeKeys,
			inactiveKeys,
			expiringSoon,
			errorCategoryRows,
		] = await Promise.all([
			userSubscription.aggregate([
				{
					$match: {
						status: { $in: PAID_STATUSES },
						paid_amount: { $gt: 0 },
					},
				},
				{
					$group: {
						_id: {
							$dateToString: {
								format: "%Y-%m",
								date: "$createdAt",
								timezone: BANGLADESH_TIME_ZONE,
							},
						},
						revenue: { $sum: "$paid_amount" },
						orders: { $sum: 1 },
					},
				},
				{ $sort: { _id: 1 } },
			]),
			userSubscription.aggregate([
				{ $match: { status: "pending", paid_amount: { $gt: 0 } } },
				{
					$group: {
						_id: null,
						revenue: { $sum: "$paid_amount" },
						orders: { $sum: 1 },
					},
				},
			]),
			userSubscription
				.find({ status: "active" })
				.select("planType paid_amount")
				.lean(),
			userSubscription.aggregate([
				{
					$match: {
						status: { $in: PAID_STATUSES },
						paid_amount: { $gt: 0 },
					},
				},
				{
					$group: {
						_id: "$packageSnapshot.name",
						revenue: { $sum: "$paid_amount" },
						orders: { $sum: 1 },
					},
				},
				{ $sort: { revenue: -1 } },
				{ $limit: 5 },
			]),
			SearchUsage.countDocuments({}),
			SearchUsage.countDocuments({
				createdAt: { $gte: currentYearStart, $lt: now },
			}),
			CourierCheck.countDocuments({}),
			CourierKey.countDocuments({ status: "active" }),
			CourierKey.countDocuments({ status: "inactive" }),
			userSubscription.countDocuments({
				status: "active",
				end_date: { $gte: now, $lte: new Date(now.getTime() + 7 * DAY_MS) },
			}),
			CourierErrorLog.aggregate([
				{
					$match: { createdAt: { $gte: sevenDaysAgo, $lt: now } },
				},
				{ $group: { _id: "$category", count: { $sum: 1 } } },
				{ $sort: { count: -1 } },
				{ $limit: 5 },
			]),
		]);

		const monthlyRevenueMap = new Map(
			monthlyRevenueRows.map((row) => [
				row._id,
				{ revenue: row.revenue, orders: row.orders },
			]),
		);
		const currentMonthRevenue = monthlyRevenueMap.get(currentMonthKey) ?? {
			revenue: 0,
			orders: 0,
		};
		const lastMonthRevenue = monthlyRevenueMap.get(previousMonthKey) ?? {
			revenue: 0,
			orders: 0,
		};

		let totalRevenue = 0;
		let totalPaidOrders = 0;
		for (const row of monthlyRevenueRows) {
			totalRevenue += row.revenue;
			totalPaidOrders += row.orders;
		}
		const currentYearRevenue = monthlyRevenueRows
			.filter((row) => row._id.startsWith(`${currentYearStr}-`))
			.reduce((sum, row) => sum + row.revenue, 0);
		const pendingRevenue = pendingRevenueRows[0]?.revenue ?? 0;
		const pendingOrders = pendingRevenueRows[0]?.orders ?? 0;
		const mrr = Math.round(
			activeSubscriptions.reduce(
				(sum, subscription) =>
					sum +
					(subscription.planType === "yearly"
						? subscription.paid_amount / 12
						: subscription.paid_amount),
				0,
			),
		);
		const averageOrderValue = totalPaidOrders
			? totalRevenue / totalPaidOrders
			: 0;
		const monthlyTrend = Array.from({ length: 6 }, (_, index) => {
			const offset = index - 5;
			const monthIndex = currentYear * 12 + (currentMonth - 1) + offset;
			const trendYear = Math.floor(monthIndex / 12);
			const trendMonth = (monthIndex % 12) + 1;
			const key = `${trendYear}-${String(trendMonth).padStart(2, "0")}`;
			const row = monthlyRevenueMap.get(key) ?? { revenue: 0, orders: 0 };
			return {
				month: key,
				label: new Date(trendYear, trendMonth - 1, 1).toLocaleString("en-US", {
					month: "short",
				}),
				revenue: row.revenue,
				orders: row.orders,
				isCurrent: offset === 0,
			};
		});
		const topPackages = topPackageRows.map((row) => ({
			name: row._id ?? "Unknown package",
			revenue: row.revenue,
			orders: row.orders,
			share: totalRevenue ? Math.round((row.revenue / totalRevenue) * 100) : 0,
		}));
		const errorsLast7Days = errorCategoryRows.reduce(
			(sum, row) => sum + row.count,
			0,
		);
		const errorCategories = errorCategoryRows.map((row) => ({
			category: row._id,
			count: row.count,
		}));
		// Derive the active plan mix from the subscriptions already fetched for
		// the MRR calculation instead of issuing another database query.
		const planMix = { monthly: 0, yearly: 0 };
		for (const subscription of activeSubscriptions) {
			planMix[subscription.planType as "monthly" | "yearly"] += 1;
		}

		const requestsByDate = new Map(
			dailyRequestRows.map((item) => [item._id, item.requests]),
		);
		const dailyRequests = Array.from({ length: 14 }, (_, index) => {
			const date = getBangladeshDateParts(
				new Date(dayStart.getTime() - (13 - index) * DAY_MS),
			);
			const dateKey = `${date.year}-${date.month}-${date.day}`;
			return { date: dateKey, requests: requestsByDate.get(dateKey) ?? 0 };
		});

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
				dailyRequests,
				revenue: {
					currentMonth: currentMonthRevenue.revenue,
					currentMonthOrders: currentMonthRevenue.orders,
					lastMonth: lastMonthRevenue.revenue,
					currentYear: currentYearRevenue,
					total: totalRevenue,
					totalOrders: totalPaidOrders,
					pending: pendingRevenue,
					pendingOrders,
					mrr,
					averageOrderValue,
					monthlyTrend,
					topPackages,
				},
				api: {
					totalCalls: totalApiCalls,
					callsThisYear: apiCallsThisYear,
					courierChecks: totalCourierChecks,
				},
				errors: {
					last7Days: errorsLast7Days,
					categories: errorCategories,
				},
				keys: {
					active: activeKeys,
					inactive: inactiveKeys,
				},
				expiringSoon,
				planMix,
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
