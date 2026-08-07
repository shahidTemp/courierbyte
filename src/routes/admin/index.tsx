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
	blue: { icon: "bg-sky-50 text-sky-700", bar: "bg-sky-500" },
	green: { icon: "bg-emerald-50 text-emerald-700", bar: "bg-emerald-500" },
	violet: { icon: "bg-violet-50 text-violet-700", bar: "bg-violet-500" },
	amber: { icon: "bg-amber-50 text-amber-700", bar: "bg-amber-500" },
	rose: { icon: "bg-rose-50 text-rose-700", bar: "bg-rose-500" },
};

function StatCard({ icon: Icon, label, value, detail, tone, href }) {
	const styles = statStyles[tone];
	const content = (
		<div className="group h-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md">
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
									className="w-full rounded-t bg-secondary/75 transition-colors group-hover:bg-secondary"
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

function ProgressRow({ label, value, total, tone }) {
	const percentage = total ? Math.min(100, Math.round((value / total) * 100)) : 0;
	return (
		<div>
			<div className="flex items-center justify-between gap-3 text-sm">
				<span className="font-semibold text-slate-600">{label}</span>
				<span className="font-extrabold text-slate-900">
					{formatNumber(value)} <span className="font-semibold text-slate-400">({percentage}%)</span>
				</span>
			</div>
			<div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
				<div className={`h-full rounded-full ${statStyles[tone].bar}`} style={{ width: `${percentage}%` }} />
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
		<main className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6 lg:px-8">
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
							<div className="grid grid-cols-3 divide-x divide-slate-200 bg-slate-50">
								<div className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Today</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{formatNumber(stats.requests.today)}</p><p className="mt-1 text-xs font-semibold text-slate-400">Bangladesh time</p></div>
								<div className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">This month</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{formatNumber(stats.requests.currentMonth)}</p><p className="mt-1 text-xs font-semibold text-slate-400">Calendar month</p></div>
								<div className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Last month</p><p className="mt-1 text-2xl font-extrabold text-slate-900">{formatNumber(stats.requests.lastMonth)}</p><p className="mt-1 text-xs font-semibold text-slate-400">Previous month</p></div>
							</div>
							<div className="border-t border-slate-200 p-4 sm:p-5"><RequestChart dailyRequests={stats.dailyRequests} /></div>
						</div>
					</div>

					<div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
						<PanelHeader title="User composition" detail="How the user base is distributed" />
						<div className="mt-5 space-y-5">
							<ProgressRow label="Enabled users" value={stats.users.active} total={stats.users.total} tone="green" />
							<ProgressRow label="Active subscribers" value={stats.activeSubscribers} total={stats.users.total} tone="violet" />
							<ProgressRow label="New users · 30 days" value={stats.users.new} total={stats.users.total} tone="amber" />
							<ProgressRow label="Older users" value={stats.users.old} total={stats.users.total} tone="rose" />
						</div>
						<div className="mt-6 border-t border-slate-100 pt-4">
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
