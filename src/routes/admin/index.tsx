// @ts-nocheck
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Activity,
	ArrowDownRight,
	ArrowRight,
	ArrowUpRight,
	CalendarDays,
	CheckCircle2,
	Clock3,
	Gauge,
	RefreshCw,
	ShieldCheck,
	Sparkles,
	UserCheck,
	UserPlus,
	Users,
	UserRoundCheck,
	UsersRound,
	Zap,
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

const formatDate = (date) =>
	date
		? new Date(date).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				 hour: "numeric",
				 minute: "2-digit",
			})
		: "—";

const formatDay = (date) =>
	new Date(`${date}T00:00:00+06:00`).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});

function MetricCard({ icon: Icon, label, value, detail, tone, href }) {
	const tones = {
		green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
		blue: "bg-sky-50 text-sky-700 ring-sky-100",
		violet: "bg-violet-50 text-violet-700 ring-violet-100",
		amber: "bg-amber-50 text-amber-700 ring-amber-100",
		rose: "bg-rose-50 text-rose-700 ring-rose-100",
	};
	const card = (
		<div className="group h-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-secondary/20 hover:shadow-xl hover:shadow-secondary/5">
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400">
						{label}
					</p>
					<p className="mt-2 truncate text-3xl font-extrabold tracking-tight text-slate-900">
						{value}
					</p>
				</div>
				<span
					className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ring-1 transition duration-300 group-hover:scale-105 ${tones[tone]}`}
				>
					<Icon className="size-5" aria-hidden="true" />
				</span>
			</div>
			<p className="mt-3 text-sm font-semibold leading-5 text-slate-500">{detail}</p>
			{href && (
				<span className="mt-4 inline-flex items-center gap-1 text-xs font-extrabold text-secondary transition group-hover:gap-2">
					View details <ArrowRight className="size-3.5" aria-hidden="true" />
				</span>
			)}
		</div>
	);

	return href ? (
		<Link to={href} className="block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-secondary/20">
			{card}
		</Link>
	) : (
		card
	);
}

function SectionHeading({ eyebrow, title, detail, action }) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">
					{eyebrow}
				</p>
				<h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
					{title}
				</h2>
				{detail && <p className="mt-1 text-sm font-semibold text-slate-500">{detail}</p>}
			</div>
			{action}
		</div>
	);
}

function RequestTrend({ dailyRequests = [] }) {
	const points = dailyRequests.slice(-14);
	const maxRequests = Math.max(...points.map((item) => item.requests), 1);

	return (
		<div className="mt-7">
			<div className="flex h-48 items-end gap-1.5 sm:gap-2">
				{points.length ? (
					points.map((item) => {
						const height = Math.max(5, (item.requests / maxRequests) * 100);
						return (
							<div key={item.date} className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
								<div className="relative flex min-h-0 flex-1 items-end">
									<div
										className="w-full rounded-t-lg bg-gradient-to-t from-secondary to-emerald-300 transition-all duration-500 group-hover:from-secondary-dark group-hover:to-emerald-400"
										style={{ height: `${height}%` }}
										title={`${formatNumber(item.requests)} requests on ${formatDay(item.date)}`}
									/>
								</div>
								<p className="truncate text-center text-[10px] font-bold text-slate-400 sm:text-xs">
									{formatDay(item.date)}
								</p>
							</div>
						);
					})
				) : (
					<div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 text-sm font-semibold text-slate-400">
						No request activity in the last 14 days
					</div>
				)}
			</div>
			<div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
				<span className="size-2 rounded-full bg-secondary" /> Successful requests recorded in Bangladesh time
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
				<p className="rounded-2xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
					Authentication error: {authError.message}
				</p>
			</main>
		);
	}

	if (isStatsError || !stats) {
		return (
			<main className="flex min-h-[32rem] items-center justify-center p-6">
				<div className="max-w-md rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-xl shadow-rose-900/5">
					<div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
						<Activity className="size-6" aria-hidden="true" />
					</div>
					<h1 className="mt-5 text-xl font-extrabold text-slate-900">Dashboard unavailable</h1>
					<p className="mt-2 text-sm leading-6 text-slate-500">
						We could not load the latest project health data. Please try again.
					</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="mt-6 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/20"
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
	const monthDelta = stats.requests.lastMonth
		? Math.round(
				((stats.requests.currentMonth - stats.requests.lastMonth) /
					stats.requests.lastMonth) *
					100,
			)
		: stats.requests.currentMonth > 0
				? 100
				: 0;
	const isGrowing = monthDelta >= 0;

	return (
		<main className="min-h-screen min-w-0 bg-slate-50/70 p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-[1500px] space-y-6">
				<section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-dark via-secondary to-emerald-700 p-6 text-white shadow-xl shadow-secondary/15 sm:p-8 lg:p-10">
					<div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-36 size-96 rounded-full bg-white/10 blur-3xl" />
					<div aria-hidden="true" className="pointer-events-none absolute -bottom-44 left-1/3 size-[30rem] rounded-full bg-emerald-300/10 blur-3xl" />
					<div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl">
							<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-50">
								<Sparkles className="size-3.5" aria-hidden="true" /> Project health overview
							</div>
							<h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
								Good morning, {user?.name ?? "Admin"}
							</h1>
							<p className="mt-3 max-w-xl text-sm leading-6 text-emerald-50/85 sm:text-base">
								A live snapshot of your users, subscriptions, and platform demand. Use it to understand what is growing and where attention is needed.
							</p>
						</div>
						<div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
							<div className="flex items-center gap-2 text-xs font-semibold text-emerald-50/75">
								<Clock3 className="size-4" aria-hidden="true" /> Updated {formatDate(stats.generatedAt)}
							</div>
							<button
								type="button"
								onClick={() => refetch()}
								disabled={isFetching}
								className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-secondary-dark shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-emerald-50 disabled:cursor-wait disabled:opacity-70 focus:outline-none focus:ring-4 focus:ring-white/30"
							>
								<RefreshCw className={`size-4 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
								Refresh data
							</button>
						</div>
					</div>
				</section>

				<section aria-labelledby="user-health-heading">
					<SectionHeading
						eyebrow="Audience"
						title="User health"
						detail="Account lifecycle and subscription coverage"
						action={
							<Link to="/admin/user/all" className="inline-flex items-center gap-1.5 text-sm font-extrabold text-secondary transition hover:gap-2.5">
								Manage users <ArrowRight className="size-4" aria-hidden="true" />
							</Link>
						}
					/>
					<h2 id="user-health-heading" className="sr-only">User health metrics</h2>
					<div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
						<MetricCard icon={UsersRound} label="Total users" value={formatNumber(stats.users.total)} detail="Registered user accounts" tone="blue" href="/admin/user/all" />
						<MetricCard icon={UserCheck} label="Active users" value={formatNumber(stats.users.active)} detail={`${activeRate}% of all users are enabled`} tone="green" href="/admin/user/all" />
						<MetricCard icon={ShieldCheck} label="Active subscribers" value={formatNumber(stats.activeSubscribers)} detail={`${subscriptionRate}% of all users have a live plan`} tone="violet" href="/admin/subscription/all" />
						<MetricCard icon={UserPlus} label="New users" value={formatNumber(stats.users.new)} detail="Created within the last 30 days" tone="amber" href="/admin/user/all" />
						<MetricCard icon={Users} label="Older users" value={formatNumber(stats.users.old)} detail="Created more than 30 days ago" tone="rose" href="/admin/user/all" />
					</div>
				</section>

			<section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
				<div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
					<SectionHeading eyebrow="Demand" title="Request activity" detail="Successful platform requests over the selected periods" />
					<div className="mt-6 grid gap-3 sm:grid-cols-3">
						<div className="rounded-2xl bg-sky-50 p-4">
							<div className="flex items-center justify-between gap-2 text-sky-700"><span className="text-xs font-extrabold uppercase tracking-wide">Today</span><Zap className="size-4" aria-hidden="true" /></div>
							<p className="mt-2 text-2xl font-extrabold text-slate-900">{formatNumber(stats.requests.today)}</p>
							<p className="mt-1 text-xs font-semibold text-slate-500">Bangladesh time</p>
						</div>
						<div className="rounded-2xl bg-violet-50 p-4">
							<div className="flex items-center justify-between gap-2 text-violet-700"><span className="text-xs font-extrabold uppercase tracking-wide">This month</span><CalendarDays className="size-4" aria-hidden="true" /></div>
							<p className="mt-2 text-2xl font-extrabold text-slate-900">{formatNumber(stats.requests.currentMonth)}</p>
							<p className="mt-1 text-xs font-semibold text-slate-500">Current calendar month</p>
						</div>
						<div className="rounded-2xl bg-amber-50 p-4">
							<div className="flex items-center justify-between gap-2 text-amber-700"><span className="text-xs font-extrabold uppercase tracking-wide">Last month</span><Activity className="size-4" aria-hidden="true" /></div>
							<p className="mt-2 text-2xl font-extrabold text-slate-900">{formatNumber(stats.requests.lastMonth)}</p>
							<p className="mt-1 text-xs font-semibold text-slate-500">Previous calendar month</p>
						</div>
					</div>
					<RequestTrend dailyRequests={stats.dailyRequests} />
				</div>

				<div className="rounded-3xl border border-secondary/15 bg-gradient-to-br from-emerald-50 via-white to-white p-6 shadow-sm sm:p-8">
					<div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20">
						<Gauge className="size-5" aria-hidden="true" />
					</div>
					<h2 className="mt-5 text-xl font-extrabold text-slate-900">Growth signal</h2>
					<p className="mt-2 text-sm leading-6 text-slate-500">A directional comparison of this month’s requests with the previous calendar month. The current month is still in progress.</p>
					<div className="mt-8 flex items-end gap-3">
						<p className={`text-5xl font-extrabold tracking-tight ${isGrowing ? "text-emerald-700" : "text-rose-600"}`}>
							{monthDelta > 0 ? "+" : ""}{monthDelta}%
						</p>
						<span className={`mb-2 inline-flex items-center gap-1 text-sm font-extrabold ${isGrowing ? "text-emerald-700" : "text-rose-600"}`}>
							{isGrowing ? <ArrowUpRight className="size-4" aria-hidden="true" /> : <ArrowDownRight className="size-4" aria-hidden="true" />}
							vs previous month
						</span>
					</div>
					<div className="mt-8 space-y-4 border-t border-secondary/10 pt-5 text-sm">
						<div className="flex items-center justify-between gap-4"><span className="font-semibold text-slate-500">Enabled user rate</span><span className="font-extrabold text-slate-900">{activeRate}%</span></div>
						<div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-secondary transition-all duration-700" style={{ width: `${activeRate}%` }} /></div>
						<div className="flex items-center justify-between gap-4"><span className="font-semibold text-slate-500">Subscription coverage</span><span className="font-extrabold text-slate-900">{subscriptionRate}%</span></div>
						<div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-violet-500 transition-all duration-700" style={{ width: `${subscriptionRate}%` }} /></div>
					</div>
				</div>
			</section>

			<section className="grid gap-6 md:grid-cols-3">
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
					<div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><UserRoundCheck className="size-5" aria-hidden="true" /></span><div><p className="text-sm font-extrabold text-slate-900">Enabled accounts</p><p className="text-xs font-semibold text-slate-500">{formatNumber(stats.users.active)} ready to use the platform</p></div></div>
				</div>
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
					<div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700"><CheckCircle2 className="size-5" aria-hidden="true" /></span><div><p className="text-sm font-extrabold text-slate-900">Live subscriptions</p><p className="text-xs font-semibold text-slate-500">{formatNumber(stats.activeSubscribers)} users currently covered</p></div></div>
				</div>
				<div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
					<div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700"><UserPlus className="size-5" aria-hidden="true" /></span><div><p className="text-sm font-extrabold text-slate-900">Fresh momentum</p><p className="text-xs font-semibold text-slate-500">{formatNumber(stats.users.new)} new users in the last 30 days</p></div></div>
				</div>
			</section>
			</div>
		</main>
	);
}
