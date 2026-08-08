// @ts-nocheck
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Activity,
	AlertTriangle,
	ArrowDownRight,
	ArrowRight,
	ArrowUpRight,
	Clock3,
	Database,
	Hourglass,
	KeyRound,
	Receipt,
	RefreshCw,
	ShieldCheck,
	TrendingUp,
	UserPlus,
	Wallet,
} from "lucide-react";
import { useState } from "react";
import { Loader } from "@/components/common/loader";
import { useAuth } from "@/context/userContext";
import { getAdminDashboardStats } from "@/server/functions/dashboard.fn";

const adminDashboardQuery = queryOptions({
	queryKey: ["admin-dashboard-stats"],
	queryFn: () => getAdminDashboardStats(),
	staleTime: 60_000,
});

export const Route = createFileRoute("/admin/")({
	component: RouteComponent,
});

const formatNumber = (value) => Number(value ?? 0).toLocaleString("en-US");

const formatDateTime = (date) =>
	date
		? new Date(date).toLocaleString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
				hour: "numeric",
				minute: "2-digit",
			})
		: "—";

const formatDay = (date) =>
	new Date(`${date}T00:00:00+06:00`).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});

const formatMoney = (value) => `৳${Number(value ?? 0).toLocaleString("en-US")}`;

function GrowthBadge({ growth }) {
	if (growth === null) {
		return (
			<span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
				First revenue this month
			</span>
		);
	}
	if (growth === 0) {
		return (
			<span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600 ring-1 ring-slate-200">
				No change vs last month
			</span>
		);
	}
	const isUp = growth > 0;
	const Icon = isUp ? ArrowUpRight : ArrowDownRight;
	return (
		<span
			className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ${isUp ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-rose-50 text-rose-700 ring-rose-200"}`}
		>
			<Icon className="size-3" aria-hidden="true" />
			{isUp ? "+" : ""}
			{growth}% vs last month
		</span>
	);
}

const statStyles = {
	blue: {
		icon: "bg-sky-100 text-sky-700",
		border: "border-l-sky-500",
	},
	green: {
		icon: "bg-emerald-100 text-emerald-700",
		border: "border-l-emerald-500",
	},
	violet: {
		icon: "bg-violet-100 text-violet-700",
		border: "border-l-violet-500",
	},
	amber: {
		icon: "bg-amber-100 text-amber-700",
		border: "border-l-amber-500",
	},
	rose: {
		icon: "bg-rose-100 text-rose-700",
		border: "border-l-rose-500",
	},
};

function StatCard({ icon: Icon, label, value, detail, tone, href }) {
	const styles = statStyles[tone];
	const content = (
		<div
			className={`group h-full rounded-xl border border-slate-200 border-l-4 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md ${styles.border}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="truncate text-xs font-bold uppercase tracking-wide text-slate-500">
						{label}
					</p>
					<p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
						{value}
					</p>
				</div>
				<span
					className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
				>
					<Icon className="size-4" aria-hidden="true" />
				</span>
			</div>
			<p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-slate-500">
				{detail}
			</p>
		</div>
	);

	return href ? (
		<Link
			to={href}
			className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
		>
			{content}
		</Link>
	) : (
		content
	);
}

function PanelHeader({ title, detail, action }) {
	return (
		<div className="flex flex-col gap-1 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
			<div>
				<h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
				{detail && (
					<p className="mt-0.5 text-xs font-semibold text-slate-500">
						{detail}
					</p>
				)}
			</div>
			{action}
		</div>
	);
}

function RequestChart({ dailyRequests = [], selectedDate, onSelectDate }) {
	const points = dailyRequests.slice(-14);
	const maxRequests = Math.max(...points.map((item) => item.requests), 1);

	if (!points.length) {
		return (
			<div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs font-semibold text-slate-400">
				No request activity in the last 14 days
			</div>
		);
	}

	return (
		<div>
			<div className="flex h-40 items-end gap-1.5 border-b border-slate-100 pb-0.5 sm:gap-2">
				{points.map((item, index) => {
					const height = Math.max(4, (item.requests / maxRequests) * 100);
					const isSelected = selectedDate === item.date;
					return (
						<button
							key={item.date}
							type="button"
							onClick={() => onSelectDate(isSelected ? null : item.date)}
							aria-label={`${formatNumber(item.requests)} requests on ${formatDay(item.date)}. ${isSelected ? "Selected" : "Select this date"}`}
							aria-pressed={isSelected}
							className={`group flex h-full min-w-0 flex-1 flex-col justify-end rounded-md px-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2 ${isSelected ? "bg-slate-100" : ""}`}
						>
							<div className="relative flex min-h-0 flex-1 items-end">
								<div
									className={`w-full rounded-t transition-all group-hover:opacity-90 ${["bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"][index % 5]} ${isSelected ? "ring-2 ring-slate-900 ring-offset-1" : ""}`}
									style={{ height: `${height}%` }}
								/>
							</div>
							<p
								className={`mt-2 truncate text-center text-[10px] font-semibold ${isSelected ? "text-slate-900" : "text-slate-400"}`}
							>
								{formatDay(item.date)}
							</p>
						</button>
					);
				})}
			</div>
		</div>
	);
}

function CompositionDonut({ total, newUsers, olderUsers }) {
	const safeTotal = Math.max(0, Number(total ?? 0));
	const safeNewUsers = Math.max(0, Number(newUsers ?? 0));
	const safeOlderUsers = Math.max(0, Number(olderUsers ?? 0));
	const radius = 58;
	const circumference = 2 * Math.PI * radius;
	const newLength = safeTotal
		? (Math.min(safeNewUsers, safeTotal) / safeTotal) * circumference
		: 0;
	const olderLength = safeTotal
		? (Math.min(safeOlderUsers, safeTotal) / safeTotal) * circumference
		: 0;
	const newPercentage = safeTotal
		? Math.round((safeNewUsers / safeTotal) * 100)
		: 0;
	const olderPercentage = safeTotal
		? Math.round((safeOlderUsers / safeTotal) * 100)
		: 0;

	return (
		<div className="flex flex-wrap items-center justify-center gap-4 sm:gap-5">
			<svg
				viewBox="0 0 160 160"
				role="img"
				aria-label={`User age composition: ${newPercentage}% new users and ${olderPercentage}% older users`}
				className="size-36 shrink-0 sm:size-40"
			>
				<circle
					cx="80"
					cy="80"
					r={radius}
					fill="none"
					stroke="#f1f5f9"
					strokeWidth="22"
				/>
				{safeTotal > 0 && (
					<>
						<circle
							cx="80"
							cy="80"
							r={radius}
							fill="none"
							stroke="#f59e0b"
							strokeWidth="22"
							strokeDasharray={`${olderLength} ${circumference}`}
							strokeDashoffset={-newLength}
							transform="rotate(-90 80 80)"
						/>
						<circle
							cx="80"
							cy="80"
							r={radius}
							fill="none"
							stroke="#8b5cf6"
							strokeWidth="22"
							strokeDasharray={`${newLength} ${circumference}`}
							transform="rotate(-90 80 80)"
						/>
					</>
				)}
				<circle cx="80" cy="80" r="39" fill="white" />
				<text
					x="80"
					y="76"
					textAnchor="middle"
					className="fill-slate-900 text-[20px] font-extrabold"
				>
					{formatNumber(safeTotal)}
				</text>
				<text
					x="80"
					y="94"
					textAnchor="middle"
					className="fill-slate-400 text-[9px] font-bold"
				>
					TOTAL USERS
				</text>
			</svg>

			<div className="w-full max-w-[190px] space-y-3">
				<div className="flex items-center justify-between gap-3 text-sm">
					<span className="flex items-center gap-2 font-semibold text-slate-600">
						<span className="size-2.5 rounded-full bg-violet-500" /> New users
					</span>
					<span className="font-extrabold text-slate-900">
						{formatNumber(safeNewUsers)}{" "}
						<span className="font-semibold text-slate-400">
							({newPercentage}%)
						</span>
					</span>
				</div>
				<div className="flex items-center justify-between gap-3 text-sm">
					<span className="flex items-center gap-2 font-semibold text-slate-600">
						<span className="size-2.5 rounded-full bg-amber-500" /> Older users
					</span>
					<span className="font-extrabold text-slate-900">
						{formatNumber(safeOlderUsers)}{" "}
						<span className="font-semibold text-slate-400">
							({olderPercentage}%)
						</span>
					</span>
				</div>
			</div>
		</div>
	);
}

function RevenueChart({ monthlyTrend = [], selectedMonth, onSelectMonth }) {
	const points = monthlyTrend.slice(-6);
	const maxRevenue = Math.max(...points.map((item) => item.revenue), 1);
	const hasRevenue = points.some((item) => item.revenue > 0);

	if (!points.length || !hasRevenue) {
		return (
			<div className="mt-4 flex h-44 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs font-semibold text-slate-400">
				No confirmed payments in the last 6 months
			</div>
		);
	}

	const selected = points.find((item) => item.month === selectedMonth);
	const totalRevenue = points.reduce((sum, item) => sum + item.revenue, 0);
	const totalOrders = points.reduce((sum, item) => sum + item.orders, 0);

	return (
		<div>
			<div className="flex h-44 items-end gap-2 border-b border-slate-100 pb-0.5 sm:gap-3">
				{points.map((item) => {
					const height = Math.max(4, (item.revenue / maxRevenue) * 100);
					const isSelected = selectedMonth === item.month;
					return (
						<button
							key={item.month}
							type="button"
							onClick={() => onSelectMonth(isSelected ? null : item.month)}
							aria-label={`${item.label} ${item.month.slice(0, 4)}: ${formatMoney(item.revenue)} from ${item.orders} order(s). ${isSelected ? "Selected" : "Select this month"}`}
							aria-pressed={isSelected}
							className={`group flex h-full min-w-0 flex-1 flex-col justify-end rounded-md px-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 focus-visible:ring-offset-2 ${isSelected ? "bg-slate-100" : ""}`}
						>
							<div className="relative flex min-h-0 flex-1 items-end">
								<div
									className={`w-full rounded-t transition-all group-hover:opacity-90 ${isSelected ? "bg-emerald-600 ring-2 ring-emerald-900 ring-offset-1" : item.isCurrent ? "bg-emerald-500" : "bg-emerald-400/70 group-hover:bg-emerald-500"}`}
									style={{ height: `${height}%` }}
								/>
							</div>
							<p
								className={`mt-2 truncate text-center text-[10px] font-semibold ${isSelected ? "text-slate-900" : item.isCurrent ? "text-emerald-700" : "text-slate-400"}`}
							>
								{item.label}
								{item.isCurrent && (
									<span
										className="ml-1 inline-block size-1.5 rounded-full bg-emerald-600 align-middle"
										aria-hidden="true"
									/>
								)}
							</p>
						</button>
					);
				})}
			</div>
			<div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-emerald-50/70 px-4 py-3 ring-1 ring-emerald-100">
				<div>
					<p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
						{selected
							? `${selected.label} ${selected.month.slice(0, 4)}`
							: "Last 6 months"}
					</p>
					<p className="mt-0.5 text-xl font-extrabold text-emerald-900">
						{selected
							? formatMoney(selected.revenue)
							: formatMoney(totalRevenue)}
					</p>
				</div>
				<p className="text-xs font-semibold text-emerald-700">
					{selected
						? `${selected.orders} order(s)`
						: `${formatNumber(totalOrders)} orders`}
				</p>
			</div>
		</div>
	);
}

function TopPackages({ packages = [] }) {
	if (!packages.length) {
		return (
			<div className="mt-5 flex h-40 items-center justify-center rounded-lg border border-dashed border-slate-200 text-xs font-semibold text-slate-400">
				No confirmed payments yet
			</div>
		);
	}

	return (
		<ul className="mt-5 space-y-4">
			{packages.map((item, index) => (
				<li key={item.name} className="flex items-center gap-3">
					<span className="w-5 shrink-0 text-center text-xs font-extrabold text-slate-400">
						{index + 1}
					</span>
					<div className="min-w-0 flex-1">
						<div className="flex items-baseline justify-between gap-3">
							<p className="truncate text-sm font-bold text-slate-800">
								{item.name}
							</p>
							<p className="shrink-0 text-sm font-extrabold text-slate-900">
								{formatMoney(item.revenue)}
							</p>
						</div>
						<div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
							<div
								className="h-full rounded-full bg-gradient-to-r from-violet-600 to-violet-400 transition-all"
								style={{ width: `${Math.max(2, item.share)}%` }}
							/>
						</div>
						<div className="mt-1 flex items-center justify-between text-[10px] font-semibold text-slate-400">
							<span>{item.orders} order(s)</span>
							<span>{item.share}% of revenue</span>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}

function PlanMix({ mix }) {
	const monthly = Number(mix?.monthly ?? 0);
	const yearly = Number(mix?.yearly ?? 0);
	const total = monthly + yearly;
	const monthlyPct = total ? Math.round((monthly / total) * 100) : 0;

	return (
		<div className="mt-4 rounded-xl border border-slate-200 p-4">
			<div className="flex items-center justify-between">
				<p className="text-xs font-bold uppercase tracking-wide text-slate-500">
					Active plan mix
				</p>
				<span className="text-xs font-semibold text-slate-400">
					{formatNumber(total)} active
				</span>
			</div>
			<div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
				<div
					className="bg-violet-500 transition-all"
					style={{ width: `${monthlyPct}%` }}
				/>
				<div
					className="bg-amber-500 transition-all"
					style={{ width: `${100 - monthlyPct}%` }}
				/>
			</div>
			<div className="mt-3 flex items-center justify-between gap-3 text-sm">
				<span className="flex items-center gap-2 font-semibold text-slate-600">
					<span
						className="size-2.5 rounded-full bg-violet-500"
						aria-hidden="true"
					/>{" "}
					Monthly
				</span>
				<span className="font-extrabold text-slate-900">
					{formatNumber(monthly)}
				</span>
			</div>
			<div className="mt-2 flex items-center justify-between gap-3 text-sm">
				<span className="flex items-center gap-2 font-semibold text-slate-600">
					<span
						className="size-2.5 rounded-full bg-amber-500"
						aria-hidden="true"
					/>{" "}
					Yearly
				</span>
				<span className="font-extrabold text-slate-900">
					{formatNumber(yearly)}
				</span>
			</div>
		</div>
	);
}

const healthTones = {
	blue: "border-sky-200 bg-sky-50 text-sky-700",
	green: "border-emerald-200 bg-emerald-50 text-emerald-700",
	violet: "border-violet-200 bg-violet-50 text-violet-700",
	amber: "border-amber-200 bg-amber-50 text-amber-700",
	rose: "border-rose-200 bg-rose-50 text-rose-700",
};

function SystemHealth({ api = {}, errors = {}, keys = {} }) {
	const tiles = [
		{
			label: "Total API calls",
			value: formatNumber(api.totalCalls),
			tone: "blue",
			icon: Database,
		},
		{
			label: "API calls this year",
			value: formatNumber(api.callsThisYear),
			tone: "violet",
			icon: TrendingUp,
		},
		{
			label: "Courier numbers checked",
			value: formatNumber(api.courierChecks),
			tone: "amber",
			icon: Receipt,
		},
		{
			label: "Active keys",
			value: formatNumber(keys.active),
			tone: "green",
			icon: KeyRound,
		},
		{
			label: "Inactive keys",
			value: formatNumber(keys.inactive),
			tone: "rose",
			icon: KeyRound,
		},
		{
			label: "Errors · last 7 days",
			value: formatNumber(errors.last7Days),
			tone: (errors.last7Days ?? 0) > 0 ? "rose" : "green",
			icon: AlertTriangle,
		},
	];

	return (
		<div className="mt-5 space-y-5">
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
				{tiles.map((tile) => {
					const Icon = tile.icon;
					return (
						<div
							key={tile.label}
							className={`rounded-xl border p-3 ${healthTones[tile.tone]}`}
						>
							<Icon className="size-4" aria-hidden="true" />
							<p className="mt-2 text-lg font-extrabold text-slate-900">
								{tile.value}
							</p>
							<p className="mt-0.5 text-[11px] font-bold leading-tight">
								{tile.label}
							</p>
						</div>
					);
				})}
			</div>
			{Boolean(errors.categories?.length) && (
				<div>
					<p className="text-xs font-bold uppercase tracking-wide text-slate-500">
						Error categories · last 7 days
					</p>
					<ul className="mt-2 divide-y divide-slate-100">
						{errors.categories.map((item) => (
							<li
								key={item.category}
								className="flex items-center justify-between gap-3 py-2 text-sm"
							>
								<span className="flex items-center gap-2 font-semibold text-slate-600">
									<span
										className="size-2 rounded-full bg-rose-400"
										aria-hidden="true"
									/>
									{item.category}
								</span>
								<span className="font-extrabold text-slate-900">
									{formatNumber(item.count)}
								</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

function SectionLabel({ children }) {
	return (
		<p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
			<span className="h-px w-4 bg-slate-300" aria-hidden="true" />
			{children}
		</p>
	);
}

const attentionTones = {
	amber: "border-l-amber-500",
	rose: "border-l-rose-500",
};

function AttentionCard({ icon: Icon, label, value, detail, tone, href }) {
	const content = (
		<div
			className={`group h-full rounded-xl border border-slate-200 border-l-4 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md ${attentionTones[tone]}`}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="truncate text-xs font-bold uppercase tracking-wide text-slate-500">
						{label}
					</p>
					<p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
						{value}
					</p>
				</div>
				<span
					className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${tone === "rose" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}
				>
					<Icon className="size-4" aria-hidden="true" />
				</span>
			</div>
			<p className="mt-2 truncate text-xs font-semibold text-slate-500">
				{detail}
			</p>
		</div>
	);

	return href ? (
		<Link
			to={href}
			className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
		>
			{content}
		</Link>
	) : (
		content
	);
}

function RouteComponent() {
	const { user, isLoading: isAuthLoading, error: authError } = useAuth();
	const [selectedRequestDate, setSelectedRequestDate] = useState(null);
	const [selectedRevenueMonth, setSelectedRevenueMonth] = useState(null);
	const {
		data: stats,
		isLoading: isStatsLoading,
		isError: isStatsError,
		refetch,
		isFetching,
	} = useQuery({
		...adminDashboardQuery,
		enabled: !isAuthLoading && Boolean(user),
		refetchInterval: 60_000,
	});

	if (isAuthLoading || isStatsLoading) return <Loader />;

	if (authError) {
		return (
			<main className="p-6">
				<p className="rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
					Authentication error: {authError.message}
				</p>
			</main>
		);
	}

	if (isStatsError || !stats) {
		return (
			<main className="flex min-h-[28rem] items-center justify-center p-6">
				<div className="max-w-md rounded-xl border border-rose-200 bg-white p-7 text-center shadow-sm">
					<Activity
						className="mx-auto size-8 text-rose-600"
						aria-hidden="true"
					/>
					<h1 className="mt-4 text-lg font-extrabold text-slate-900">
						Dashboard unavailable
					</h1>
					<p className="mt-1 text-sm text-slate-500">
						We could not load the latest project data.
					</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="mt-5 rounded-lg bg-secondary px-4 py-2 text-sm font-bold text-white hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary/30"
					>
						Try again
					</button>
				</div>
			</main>
		);
	}

	const subscriptionRate = stats.users.total
		? Math.round((stats.activeSubscribers / stats.users.total) * 100)
		: 0;
	const revenueMonthGrowth =
		stats.revenue.lastMonth > 0
			? Math.round(
					((stats.revenue.currentMonth - stats.revenue.lastMonth) /
						stats.revenue.lastMonth) *
						100,
				)
			: stats.revenue.currentMonth > 0
				? null
				: 0;
	const hour = Number(
		new Intl.DateTimeFormat("en-US", {
			timeZone: "Asia/Dhaka",
			hour: "numeric",
			hour12: false,
		}).format(new Date()),
	);
	const greeting =
		hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
	const todayLabel = new Intl.DateTimeFormat("en-US", {
		timeZone: "Asia/Dhaka",
		weekday: "long",
		month: "long",
		day: "numeric",
	}).format(new Date());
	const attentionItems = [
		{
			icon: Hourglass,
			label: "Pending payments",
			value: formatMoney(stats.revenue.pending),
			detail: `${stats.revenue.pendingOrders} awaiting verification`,
			tone: "amber",
			href: "/admin/subscription/all",
		},
		{
			icon: Clock3,
			label: "Expiring soon",
			value: formatNumber(stats.expiringSoon),
			detail: "Active plans ending within 7 days",
			tone: "amber",
			href: "/admin/subscription/all",
		},
	];
	if (user?.role === "super_admin") {
		attentionItems.push(
			{
				icon: KeyRound,
				label: "Inactive keys",
				value: formatNumber(stats.keys.inactive),
				detail: "Courier keys currently revoked",
				tone: "rose",
				href: "/admin/keys/all",
			},
			{
				icon: AlertTriangle,
				label: "Errors · 7 days",
				value: formatNumber(stats.errors.last7Days),
				detail: "Failed courier checks this week",
				tone: "rose",
				href: "/admin/keys/errors",
			},
		);
	}
	const selectedRequest = stats.dailyRequests?.find(
		(item) => item.date === selectedRequestDate,
	);
	const displayedTodayRequests =
		selectedRequest?.requests ?? stats.requests.today;
	return (
		<main className="min-h-screen bg-slate-100/70 px-4 py-5 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-[1500px] space-y-5">
				<header className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-extrabold tracking-tight text-secondary-dark">
							Dashboard
						</h1>
						<p className="mt-1 text-sm font-semibold text-slate-500">
							{greeting}, {user?.name ?? "Admin"}
							<span className="mx-2 text-slate-300" aria-hidden="true">
								·
							</span>
							{todayLabel}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<span className="hidden items-center gap-1.5 text-xs font-semibold text-slate-400 sm:inline-flex">
							<Clock3 className="size-3.5" aria-hidden="true" /> Updated{" "}
							{formatDateTime(stats.generatedAt)}
						</span>
						<button
							type="button"
							onClick={() => refetch()}
							disabled={isFetching}
							className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-secondary/40 hover:text-secondary disabled:cursor-wait disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-secondary/30"
						>
							<RefreshCw
								className={`size-4 ${isFetching ? "animate-spin" : ""}`}
								aria-hidden="true"
							/>
							Refresh
						</button>
					</div>
				</header>

				<div className="space-y-3">
					<SectionLabel>Overview</SectionLabel>
					<section
						className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
						aria-label="Overview metrics"
					>
						<StatCard
							icon={Wallet}
							label="Revenue this month"
							value={formatMoney(stats.revenue.currentMonth)}
							detail={
								<>
									<GrowthBadge growth={revenueMonthGrowth} />
									<span>
										{stats.revenue.currentMonthOrders} order(s) ·{" "}
										{formatMoney(stats.revenue.lastMonth)} last month
									</span>
								</>
							}
							tone="green"
						/>
						<StatCard
							icon={ShieldCheck}
							label="Active subscribers"
							value={formatNumber(stats.activeSubscribers)}
							detail={`${subscriptionRate}% of users covered`}
							tone="violet"
							href="/admin/subscription/all"
						/>
						<StatCard
							icon={Activity}
							label="Requests today"
							value={formatNumber(stats.requests.today)}
							detail="Successful checks · BD time"
							tone="blue"
						/>
						<StatCard
							icon={UserPlus}
							label="New users"
							value={formatNumber(stats.users.new)}
							detail="Registered in the last 30 days"
							tone="amber"
							href="/admin/user/all"
						/>
						<StatCard
							icon={Hourglass}
							label="Pending payments"
							value={formatMoney(stats.revenue.pending)}
							detail={`${stats.revenue.pendingOrders} awaiting verification`}
							tone="rose"
							href="/admin/subscription/all"
						/>
					</section>
				</div>

				<div className="space-y-3">
					<SectionLabel>Needs attention</SectionLabel>
					<section
						className={`grid gap-3 sm:grid-cols-2 ${attentionItems.length > 2 ? "xl:grid-cols-4" : "xl:grid-cols-2"}`}
						aria-label="Items needing action"
					>
						{attentionItems.map((item) => (
							<AttentionCard key={item.label} {...item} />
						))}
					</section>
				</div>

				<div className="space-y-5">
					<SectionLabel>Analytics</SectionLabel>
					<section className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
						<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
							<PanelHeader
								title="Revenue trend"
								detail="Confirmed payments by month"
								action={
									<span className="text-xs font-semibold text-slate-400">
										Current month in progress
									</span>
								}
							/>
							<div className="mt-4">
								<RevenueChart
									monthlyTrend={stats.revenue.monthlyTrend}
									selectedMonth={selectedRevenueMonth}
									onSelectMonth={setSelectedRevenueMonth}
								/>
								<p className="mt-3 flex items-center justify-between text-xs font-semibold text-slate-400">
									<span>All-time confirmed revenue</span>
									<span className="font-extrabold text-slate-600">
										{formatMoney(stats.revenue.total)}
									</span>
								</p>
							</div>
						</div>

						<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
							<PanelHeader
								title="Revenue insights"
								detail="Recurring value and order economics"
							/>
							<div className="mt-4 grid grid-cols-2 gap-3">
								<div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
									<p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">
										MRR
									</p>
									<p className="mt-1 text-lg font-extrabold text-emerald-900">
										{formatMoney(stats.revenue.mrr)}
									</p>
									<p className="mt-0.5 text-[11px] font-semibold text-emerald-700/80">
										Est. from active plans
									</p>
								</div>
								<div className="rounded-xl border border-violet-200 bg-violet-50/70 p-4">
									<p className="text-[11px] font-bold uppercase tracking-wide text-violet-700">
										Avg order value
									</p>
									<p className="mt-1 text-lg font-extrabold text-violet-900">
										{formatMoney(stats.revenue.averageOrderValue)}
									</p>
									<p className="mt-0.5 text-[11px] font-semibold text-violet-700/80">
										Per confirmed payment
									</p>
								</div>
								<div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4">
									<p className="text-[11px] font-bold uppercase tracking-wide text-sky-700">
										Confirmed orders
									</p>
									<p className="mt-1 text-lg font-extrabold text-sky-900">
										{formatNumber(stats.revenue.totalOrders)}
									</p>
									<p className="mt-0.5 text-[11px] font-semibold text-sky-700/80">
										All time
									</p>
								</div>
								<div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
									<p className="text-[11px] font-bold uppercase tracking-wide text-amber-700">
										Revenue this year
									</p>
									<p className="mt-1 text-lg font-extrabold text-amber-900">
										{formatMoney(stats.revenue.currentYear)}
									</p>
									<p className="mt-0.5 text-[11px] font-semibold text-amber-700/80">
										Confirmed payments so far
									</p>
								</div>
							</div>
							<PlanMix mix={stats.planMix} />
						</div>
					</section>

					<section className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
						<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
							<PanelHeader
								title="Request activity"
								detail="Successful platform requests by period"
								action={
									<span className="text-xs font-semibold text-slate-400">
										Current month is in progress
									</span>
								}
							/>
							<div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
								<div className="grid grid-cols-3 divide-x divide-slate-200 bg-white">
									<div className="border-t-4 border-sky-500 bg-sky-50/70 p-4">
										<p className="text-xs font-bold uppercase tracking-wide text-sky-700">
											{selectedRequest
												? formatDay(selectedRequest.date)
												: "Today"}
										</p>
										<p className="mt-1 text-2xl font-extrabold text-slate-900">
											{formatNumber(displayedTodayRequests)}
										</p>
										<p className="mt-1 text-xs font-semibold text-slate-500">
											{selectedRequest ? "Selected day" : "Bangladesh time"}
										</p>
									</div>
									<div className="border-t-4 border-violet-500 bg-violet-50/70 p-4">
										<p className="text-xs font-bold uppercase tracking-wide text-violet-700">
											This month
										</p>
										<p className="mt-1 text-2xl font-extrabold text-slate-900">
											{formatNumber(stats.requests.currentMonth)}
										</p>
									</div>
									<div className="border-t-4 border-amber-500 bg-amber-50/70 p-4">
										<p className="text-xs font-bold uppercase tracking-wide text-amber-700">
											Last month
										</p>
										<p className="mt-1 text-2xl font-extrabold text-slate-900">
											{formatNumber(stats.requests.lastMonth)}
										</p>
									</div>
								</div>
								<div className="border-t border-slate-200 p-4 sm:p-5">
									<RequestChart
										dailyRequests={stats.dailyRequests}
										selectedDate={selectedRequestDate}
										onSelectDate={setSelectedRequestDate}
									/>
								</div>
							</div>
						</div>

						<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
							<PanelHeader
								title="User composition"
								detail="New versus older accounts"
							/>
							<div className="mt-5">
								<CompositionDonut
									total={stats.users.total}
									newUsers={stats.users.new}
									olderUsers={stats.users.old}
								/>
							</div>
							<div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
								<div className="rounded-lg bg-slate-50 p-3">
									<p className="text-xs font-semibold text-slate-600">
										Total users
									</p>
									<p className="mt-1 text-lg font-extrabold text-slate-900">
										{formatNumber(stats.users.total)}
									</p>
								</div>
								<div className="rounded-lg bg-emerald-50 p-3">
									<p className="text-xs font-semibold text-emerald-700">
										Active users
									</p>
									<p className="mt-1 text-lg font-extrabold text-emerald-800">
										{formatNumber(stats.users.active)}
									</p>
								</div>
								<div className="rounded-lg bg-amber-50 p-3">
									<p className="text-xs font-semibold text-amber-700">
										New · 30 days
									</p>
									<p className="mt-1 text-lg font-extrabold text-amber-800">
										{formatNumber(stats.users.new)}
									</p>
								</div>
								<div className="rounded-lg bg-rose-50 p-3">
									<p className="text-xs font-semibold text-rose-700">Older</p>
									<p className="mt-1 text-lg font-extrabold text-rose-800">
										{formatNumber(stats.users.old)}
									</p>
								</div>
							</div>
							<div className="mt-4">
								<Link
									to="/admin/user/all"
									className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:gap-2.5"
								>
									View all users{" "}
									<ArrowRight className="size-4" aria-hidden="true" />
								</Link>
							</div>
						</div>
					</section>
				</div>

				<div className="space-y-3">
					<SectionLabel>Operations</SectionLabel>
					<section className="grid gap-5 xl:grid-cols-2">
						<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
							<PanelHeader
								title="Top packages by revenue"
								detail="Ranked by confirmed payments"
								action={
									<Link
										to="/admin/package/all"
										className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:gap-2.5"
									>
										Manage packages{" "}
										<ArrowRight className="size-4" aria-hidden="true" />
									</Link>
								}
							/>
							<TopPackages packages={stats.revenue.topPackages} />
						</div>

						<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
							<PanelHeader
								title="System health"
								detail="Usage, reliability and the courier key pool"
							/>
							<SystemHealth
								api={stats.api}
								errors={stats.errors}
								keys={stats.keys}
							/>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
