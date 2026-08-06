// @ts-nocheck
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Activity,
	ArrowRight,
	CalendarDays,
	CheckCircle2,
	Clock3,
	CreditCard,
	Gauge,
	Gem,
	Search,
	ShieldCheck,
	Sparkles,
	Zap,
} from "lucide-react";
import { Loader } from "@/components/common/loader";
import { useAuth } from "@/context/userContext";
import { getDashboardStats } from "@/server/functions/dashboard.fn";

const dashboardStatsQuery = queryOptions({
	queryKey: ["dashboard-stats"],
	queryFn: () => getDashboardStats(),
});

export const Route = createFileRoute("/panel/")({
	component: RouteComponent,
});

const formatDate = (date) =>
	date
		? new Date(date).toLocaleDateString("bn-BD", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
		: "—";

const formatNumber = (value) => Number(value ?? 0).toLocaleString("bn-BD");

const planTypeLabel = {
	monthly: "মাসিক প্ল্যান",
	yearly: "বার্ষিক প্ল্যান",
};

function StatCard({ icon: Icon, eyebrow, value, detail, tone }) {
	const tones = {
		green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
		blue: "bg-sky-50 text-sky-700 ring-sky-100",
		amber: "bg-amber-50 text-amber-700 ring-amber-100",
		violet: "bg-violet-50 text-violet-700 ring-violet-100",
	};

	return (
		<div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-secondary/5">
			<div className="flex items-start justify-between gap-3">
				<div>
					<p className="text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
						{eyebrow}
					</p>
					<p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
						{value}
					</p>
				</div>
				<span
					className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ring-1 transition duration-300 group-hover:scale-105 ${tones[tone]}`}
				>
					<Icon className="size-5" aria-hidden="true" />
				</span>
			</div>
			<p className="mt-3 text-sm font-semibold text-slate-500">{detail}</p>
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
	} = useQuery({
		...dashboardStatsQuery,
		enabled: !isAuthLoading && Boolean(user),
	});
	const subscription = stats?.subscription;
	const progress = subscription
		? Math.min(
				100,
				(subscription.used / Math.max(subscription.totalLimit, 1)) * 100,
			)
		: 0;

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
					<h1 className="mt-5 text-xl font-extrabold text-slate-900">
						ড্যাশবোর্ড লোড করা যায়নি
					</h1>
					<p className="mt-2 text-sm leading-6 text-slate-500">
						আপনার ব্যবহারের তথ্য আনতে সমস্যা হয়েছে। আবার চেষ্টা করুন।
					</p>
					<button
						type="button"
						onClick={() => refetch()}
						className="mt-6 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/20"
					>
						আবার চেষ্টা করুন
					</button>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen min-w-0 bg-slate-50/60 p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-7xl space-y-6">
				<section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary-dark via-secondary to-emerald-700 p-6 text-white shadow-xl shadow-secondary/15 sm:p-8 lg:p-10">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-white/10 blur-3xl"
					/>
					<div
						aria-hidden="true"
						className="pointer-events-none absolute -bottom-40 left-1/3 size-96 rounded-full bg-emerald-300/10 blur-3xl"
					/>
					<div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-emerald-50 backdrop-blur">
								<Sparkles className="size-3.5" aria-hidden="true" />
								আপনার ওভারভিউ
							</div>
							<h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
								স্বাগতম, {user?.name ?? "ব্যবহারকারী"}!
							</h1>
							<p className="mt-3 max-w-2xl text-sm leading-6 text-emerald-50/85 sm:text-base">
								আপনার সাবস্ক্রিপশন এবং কুরিয়ার সার্চ ব্যবহারের সর্বশেষ অবস্থা এক জায়গায় দেখুন।
							</p>
						</div>
						<Link
							to="/panel/fraud-checker"
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-secondary-dark shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-white/30"
						>
							<Search className="size-4" aria-hidden="true" />
							নতুন সার্চ করুন
							<ArrowRight className="size-4" aria-hidden="true" />
						</Link>
					</div>
				</section>

				<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<StatCard
						icon={Search}
						eyebrow="আজকের সার্চ"
						value={formatNumber(stats.todaySearches)}
						detail="বাংলাদেশ সময় অনুযায়ী সফল সার্চ"
						tone="blue"
					/>
					<StatCard
						icon={Gauge}
						eyebrow="অবশিষ্ট সীমা"
						value={subscription ? formatNumber(subscription.remaining) : "—"}
						detail={
							subscription ? "এই সাবস্ক্রিপশনে বাকি সার্চ" : "কোনো সক্রিয় প্ল্যান নেই"
						}
						tone="green"
					/>
					<StatCard
						icon={Zap}
						eyebrow="ব্যবহৃত সার্চ"
						value={subscription ? formatNumber(subscription.used) : "—"}
						detail={
							subscription
								? `মোট ${formatNumber(subscription.totalLimit)} সার্চের মধ্যে`
								: "সাবস্ক্রিপশন নিলে শুরু করুন"
						}
						tone="violet"
					/>
					<StatCard
						icon={CalendarDays}
						eyebrow="মেয়াদ শেষ"
						value={subscription ? formatDate(subscription.endDate) : "—"}
						detail={
							subscription
								? "আপনার বর্তমান প্ল্যানের শেষ তারিখ"
								: "সক্রিয় প্ল্যানের তথ্য নেই"
						}
						tone="amber"
					/>
				</section>

				{subscription ? (
					<section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
						<div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
								<div className="flex items-start gap-3">
									<span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
										<Gem className="size-6" aria-hidden="true" />
									</span>
									<div>
										<p className="text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">
											বর্তমান সাবস্ক্রিপশন
										</p>
										<h2 className="mt-1 text-2xl font-extrabold text-slate-900">
											{subscription.name}
										</h2>
										<p className="mt-1 text-sm font-semibold text-slate-500">
											{planTypeLabel[subscription.planType] ??
												subscription.planType}
										</p>
									</div>
								</div>
								<span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-extrabold text-emerald-700">
									<CheckCircle2 className="size-3.5" aria-hidden="true" />
									সক্রিয়
								</span>
							</div>

							<div className="mt-8">
								<div className="mb-2 flex items-center justify-between gap-3 text-sm">
									<span className="font-bold text-slate-700">
										সার্চ ব্যবহারের অগ্রগতি
									</span>
									<span className="font-extrabold text-secondary">
										{formatNumber(subscription.used)} /{" "}
										{formatNumber(subscription.totalLimit)}
									</span>
								</div>
								<div className="h-3 overflow-hidden rounded-full bg-slate-100">
									<div
										className="h-full rounded-full bg-gradient-to-r from-secondary to-emerald-400 transition-all duration-700"
										style={{ width: `${progress}%` }}
									/>
								</div>
								<p className="mt-3 text-xs font-semibold text-slate-400">
									ইন-ফ্লাইট রিকোয়েস্টসহ অবশিষ্ট:{" "}
									{formatNumber(subscription.remaining)}
								</p>
							</div>
						</div>

						<div className="rounded-3xl border border-secondary/15 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm sm:p-8">
							<div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20">
								<CreditCard className="size-5" aria-hidden="true" />
							</div>
							<h2 className="mt-5 text-xl font-extrabold text-slate-900">
								প্ল্যানের তথ্য
							</h2>
							<div className="mt-5 space-y-4 text-sm">
								<div className="flex items-center justify-between gap-3 border-b border-secondary/10 pb-3">
									<span className="font-semibold text-slate-500">মোট সীমা</span>
									<span className="font-extrabold text-slate-800">
										{formatNumber(subscription.totalLimit)}
									</span>
								</div>
								<div className="flex items-center justify-between gap-3 border-b border-secondary/10 pb-3">
									<span className="font-semibold text-slate-500">
										আজকের সার্চ
									</span>
									<span className="font-extrabold text-slate-800">
										{formatNumber(stats.todaySearches)}
									</span>
								</div>
								<div className="flex items-center justify-between gap-3">
									<span className="flex items-center gap-1.5 font-semibold text-slate-500">
										<Clock3 className="size-4" aria-hidden="true" /> মেয়াদ
									</span>
									<span className="font-extrabold text-slate-800">
										{formatDate(subscription.endDate)}
									</span>
								</div>
							</div>
							<Link
								to="/panel/billing"
								className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-secondary transition hover:gap-3"
							>
								বিলিং দেখুন <ArrowRight className="size-4" aria-hidden="true" />
							</Link>
						</div>
					</section>
				) : (
					<section className="overflow-hidden rounded-3xl border border-dashed border-secondary/25 bg-white p-6 shadow-sm sm:p-10">
						<div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-start gap-4">
								<span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
									<ShieldCheck className="size-6" aria-hidden="true" />
								</span>
								<div>
									<h2 className="text-xl font-extrabold text-slate-900">
										কোনো সক্রিয় সাবস্ক্রিপশন নেই
									</h2>
									<p className="mt-1 text-sm leading-6 text-slate-500">
										সার্চ শুরু করতে আপনার জন্য উপযুক্ত একটি প্ল্যান বেছে নিন।
									</p>
								</div>
							</div>
							<Link
								to="/panel/subscription-plans"
								className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-secondary/15 transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/20 sm:w-auto"
							>
								প্ল্যান দেখুন <ArrowRight className="size-4" aria-hidden="true" />
							</Link>
						</div>
					</section>
				)}
			</div>
		</main>
	);
}
