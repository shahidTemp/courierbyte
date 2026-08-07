// @ts-nocheck
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Activity,
	ArrowRight,
	Clock3,
	RefreshCw,
	ShieldCheck,
	UserCheck,
	UserPlus,
	Users,
	UsersRound,
} from "lucide-react";
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
		<div className={`group h-full rounded-xl border border-slate-200 border-l-4 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md ${styles.border}`}>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="truncate text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
					<p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">{value}</p>
				</div>
				<span className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}>
					<Icon className="size-4" aria-hidden="true" />
				</span>
			</div>
			<p className="mt-2 truncate text-xs font-semibold text-slate-500">{detail}</p>
			{href && (
				<span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-secondary transition group-hover:gap-1.5">
					Open <ArrowRight className="size-3" aria-hidden="true" />
				</span>
			)}
		</div>
	);

	return href ? (
		<Link to={href} className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40">
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
				{detail && <p className="mt-0.5 text-xs font-semibold text-slate-500">{detail}</p>}
			</div>
			{action}
		</div>
	);
}

function RequestChart({ dailyRequests = [] }) {
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
				{points.map((item) => {
					const height = Math.max(4, (item.requests / maxRequests) * 100);
					return (
						<div key={item.date} className="group flex h-full min-w-0 flex-1 flex-col justify-end">
							<div className="relative flex min-h-0 flex-1 items-end">
								<div
									className={`w-full rounded-t transition-colors group-hover:opacity-90 ${["bg-sky-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"][points.indexOf(item) % 5]}`}
									style={{ height: `${height}%` }}
									title={`${formatNumber(item.requests)} requests on ${formatDay(item.date)}`}
								/>
							</div>
							<p className="mt-2 truncate text-center text-[10px] font-semibold text-slate-400">
								{formatDay(item.date)}
							</p>
						</div>
					);
				})}
			</div>
			<p className="mt-3 text-[11px] font-semibold text-slate-400">
				Successful requests · Bangladesh time · Hover a bar for details
			</p>
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
				<circle cx="80" cy="80" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="22" />
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
				<text x="80" y="76" textAnchor="middle" className="fill-slate-900 text-[20px] font-extrabold">
					{formatNumber(safeTotal)}
				</text>
				<text x="80" y="94" textAnchor="middle" className="fill-slate-400 text-[9px] font-bold">
					TOTAL USERS
				</text>
			</svg>

			<div className="w-full max-w-[190px] space-y-3">
				<div className="flex items-center justify-between gap-3 text-sm">
					<span className="flex items-center gap-2 font-semibold text-slate-600">
						<span className="size-2.5 rounded-full bg-violet-500" /> New users
					</span>
					<span className="font-extrabold text-slate-900">
						{formatNumber(safeNewUsers)} <span className="font-semibold text-slate-400">({newPercentage}%)</span>
					</span>
				</div>
				<div className="flex items-center justify-between gap-3 text-sm">
					<span className="flex items-center gap-2 font-semibold text-slate-600">
						<span className="size-2.5 rounded-full bg-amber-500" /> Older users
					</span>
					<span className="font-extrabold text-slate-900">
						{formatNumber(safeOlderUsers)} <span className="font-semibold text-slate-400">({olderPercentage}%)</span>
					</span>
				</div>
			</div>
		</div>
	);
}

function RouteComponent() {
	const { user, isLoading: isAuthLoading, error: authError } = useAuth();
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
					<Activity className="mx-auto size-8 text-rose-600" aria-hidden="true" />
					<h1 className="mt-4 text-lg font-extrabold text-slate-900">Dashboard unavailable</h1>
					<p className="mt-1 text-sm text-slate-500">We could not load the latest project data.</p>
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

	const activeRate = stats.users.total
		? Math.round((stats.users.active / stats.users.total) * 100)
		: 0;
	const subscriptionRate = stats.users.total
		? Math.round((stats.activeSubscribers / stats.users.total) * 100)
		: 0;
	return (
		<main className="min-h-screen bg-slate-100/70 px-4 py-5 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-[1500px] space-y-5">
				<header className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-extrabold tracking-tight text-secondary-dark">Dashboard</h1>
						<p className="mt-0.5 text-sm font-semibold text-slate-500">Project overview and platform activity</p>
					</div>
					<div className="flex items-center gap-3">
						<span className="hidden items-center gap-1.5 text-xs font-semibold text-slate-400 sm:inline-flex">
							<Clock3 className="size-3.5" aria-hidden="true" /> Updated {formatDateTime(stats.generatedAt)}
						</span>
						<button
							type="button"
							onClick={() => refetch()}
							disabled={isFetching}
							className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-secondary/40 hover:text-secondary disabled:cursor-wait disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-secondary/30"
						>
							<RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
							Refresh
						</button>
					</div>
				</header>

				<section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" aria-label="User metrics">
					<StatCard icon={UsersRound} label="Total users" value={formatNumber(stats.users.total)} detail="Registered user accounts" tone="blue" href="/admin/user/all" />
					<StatCard icon={UserCheck} label="Active users" value={formatNumber(stats.users.active)} detail={`${activeRate}% of users enabled`} tone="green" href="/admin/user/all" />
					<StatCard icon={ShieldCheck} label="Active subscribers" value={formatNumber(stats.activeSubscribers)} detail={`${subscriptionRate}% of users covered`} tone="violet" href="/admin/subscription/all" />
					<StatCard icon={UserPlus} label="New users" value={formatNumber(stats.users.new)} detail="Created in the last 30 days" tone="amber" href="/admin/user/all" />
					<StatCard icon={Users} label="Older users" value={formatNumber(stats.users.old)} detail="Created over 30 days ago" tone="rose" href="/admin/user/all" />
				</section>

				<section className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
					<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
						<PanelHeader
							title="Request activity"
							detail="Successful platform requests by period"
							action={<span className="text-xs font-semibold text-slate-400">Current month is in progress</span>}
						/>
						<div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
							<div className="grid grid-cols-3 divide-x divide-slate-200 bg-white">
								<div className="border-t-4 border-sky-500 bg-sky-50/70 p-4"><p className="text-xs font-bold uppercase tracking-wide text-sky-700">Today</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{formatNumber(stats.requests.today)}</p><p className="mt-1 text-xs font-semibold text-slate-500">Bangladesh time</p></div>
								<div className="border-t-4 border-violet-500 bg-violet-50/70 p-4"><p className="text-xs font-bold uppercase tracking-wide text-violet-700">This month</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{formatNumber(stats.requests.currentMonth)}</p><p className="mt-1 text-xs font-semibold text-slate-500">Calendar month</p></div>
								<div className="border-t-4 border-amber-500 bg-amber-50/70 p-4"><p className="text-xs font-bold uppercase tracking-wide text-amber-700">Last month</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{formatNumber(stats.requests.lastMonth)}</p><p className="mt-1 text-xs font-semibold text-slate-500">Previous month</p></div>
							</div>
							<div className="border-t border-slate-200 p-4 sm:p-5"><RequestChart dailyRequests={stats.dailyRequests} /></div>
						</div>
					</div>

					<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
						<PanelHeader title="User composition" detail="New versus older accounts" />
						<div className="mt-5">
							<CompositionDonut
								total={stats.users.total}
								newUsers={stats.users.new}
								olderUsers={stats.users.old}
							/>
						</div>
						<div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
							<div className="rounded-lg bg-emerald-50 p-3">
								<p className="text-xs font-semibold text-emerald-700">Active users</p>
								<p className="mt-1 text-lg font-extrabold text-emerald-800">{formatNumber(stats.users.active)}</p>
							</div>
							<div className="rounded-lg bg-violet-50 p-3">
								<p className="text-xs font-semibold text-violet-700">Active subscribers</p>
								<p className="mt-1 text-lg font-extrabold text-violet-800">{formatNumber(stats.activeSubscribers)}</p>
							</div>
						</div>
						<div className="mt-4">
							<Link to="/admin/user/all" className="inline-flex items-center gap-1.5 text-sm font-bold text-secondary hover:gap-2.5">
								View all users <ArrowRight className="size-4" aria-hidden="true" />
							</Link>
						</div>
					</div>
				</section>

			</div>
		</main>
	);
}
