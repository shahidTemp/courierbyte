import {
	AlertTriangle,
	CalendarDays,
	CheckCircle2,
	ShieldAlert,
	XCircle,
} from "lucide-react";
import { PieChart } from "@/components/user/pieChart";
import { formateDate } from "@/utils/formateDate";

type CourierStats = {
	name: string;
	logo: string;
	total_parcel: number;
	success_parcel: number;
	cancelled_parcel: number;
	success_ratio: number;
};

type SummaryStats = {
	total_parcel: number;
	success_parcel: number;
	cancelled_parcel: number;
	success_ratio: number;
};

type CustomerReview = {
	id?: number;
	name?: string;
	rating?: string;
	comment?: string;
	created_at?: string;
};

export type FraudResult = {
	status?: string;
	data?: Record<string, CourierStats> & { summary?: SummaryStats };
	reports?: unknown[];
	reviews?: CustomerReview[];
};

type RiskLevel = {
	title: string;
	message: string;
	icon: typeof CheckCircle2;
	badge: string;
	bar: string;
	text: string;
	glow: string;
};

const getRiskLevel = (ratio: number): RiskLevel => {
	if (ratio >= 80) {
		return {
			title: "নিরাপদ কাস্টমার",
			message: "এই কাস্টমারটি নিরাপদ — নিশ্চিন্তে পার্সেল পাঠাতে পারেন।",
			icon: CheckCircle2,
			badge: "from-emerald-500 to-teal-600",
			bar: "bg-emerald-500",
			text: "text-emerald-600",
			glow: "bg-emerald-400",
		};
	}
	if (ratio >= 50) {
		return {
			title: "কম ঝুঁকি",
			message: "পার্সেল পাঠানোর আগে সাবধান হোন।",
			icon: ShieldAlert,
			badge: "from-amber-400 to-orange-500",
			bar: "bg-amber-400",
			text: "text-amber-600",
			glow: "bg-amber-400",
		};
	}
	return {
		title: "উচ্চ ঝুঁকি",
		message: "পার্সেল পাঠানোর আগে কুরিয়ার চার্জ নিন।",
		icon: XCircle,
		badge: "from-rose-500 to-red-600",
		bar: "bg-rose-500",
		text: "text-rose-600",
		glow: "bg-rose-400",
	};
};

function CourierRow({ courier }: { courier: CourierStats }) {
	return (
		<tr className="border-t border-slate-100">
			<td className="px-3 py-3">
				<div className="flex min-w-36 items-center">
					<img
						src={courier.logo}
						alt={courier.name}
						loading="lazy"
						className="h-16 w-28 shrink-0 object-contain p-2"
					/>
				</div>
			</td>
			<td className="px-3 py-3 text-right text-lg font-bold text-slate-700">
				{courier.total_parcel}
			</td>
			<td className="px-3 py-3 text-right text-lg font-bold text-emerald-600">
				{courier.success_parcel}
			</td>
			<td className="px-3 py-3 text-right text-lg font-bold text-rose-500">
				{courier.cancelled_parcel}
			</td>
			<td className="px-3 py-3">
				<PieChart
					value={courier.success_ratio}
					total={courier.total_parcel}
					size="small"
				/>
			</td>
		</tr>
	);
}
export function CourierStatus({ result }: { result: FraudResult }) {
	const { data = {}, reviews = [] } = result;
	const { summary, ...courierMap } = data;
	const couriers = Object.values(courierMap).sort(
		(a, b) => b.total_parcel - a.total_parcel,
	);

	const ratio = summary?.success_ratio ?? 0;
	const level = getRiskLevel(ratio);
	const VerdictIcon = level.icon;

	return (
		<div className="mt-6 space-y-4">
			{/* Risk verdict header */}
			<div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
				<span
					aria-hidden="true"
					className={`pointer-events-none absolute -right-16 -top-16 size-52 rounded-full ${level.glow} opacity-10 blur-3xl`}
				/>
				<div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-4">
						<span
							className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${level.badge} text-white shadow-lg`}
						>
							<VerdictIcon className="size-6" aria-hidden="true" />
						</span>
						<div>
							<p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
								ঝুঁকি মূল্যায়ন
							</p>
							<p className={`text-lg font-extrabold ${level.text}`}>
								{level.title}
							</p>
							<p className="mt-0.5 max-w-md text-sm font-medium text-slate-600">
								{level.message}
							</p>
						</div>
					</div>
					<div className="shrink-0 rounded-2xl border border-slate-100 bg-slate-50/80 px-5 py-3.5">
						<p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
							সফলতার হার
						</p>
						<p
							className={`mt-0.5 text-3xl font-extrabold tabular-nums ${level.text}`}
						>
							{ratio}
							<span className="ml-0.5 text-lg">%</span>
						</p>
						<div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-slate-200">
							<div
								className={`h-full rounded-full ${level.bar}`}
								style={{ width: `${ratio}%` }}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Customer complaints */}
			{reviews.length && (
				<section className="rounded-2xl border border-rose-200/70 bg-white p-5 shadow-sm">
					<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
						<h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
							<AlertTriangle className="size-4 text-rose-500" />
							কাস্টমার অভিযোগ
						</h3>
						{reviews.length > 0 && (
							<span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600">
								{reviews.length} টি অভিযোগ
							</span>
						)}
					</div>

					<ul className="space-y-3">
						{reviews.map((review) => {
							const initial = (review.name ?? "?").trim().charAt(0) || "?";
							return (
								<li
									key={review.id}
									className="rounded-xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/50 p-4 transition hover:border-rose-300 hover:shadow-md"
								>
									<div className="flex flex-wrap items-center justify-between gap-3">
										<div className="flex items-center gap-3">
											<span
												aria-hidden="true"
												className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-sm font-extrabold text-white shadow-sm"
											>
												{initial}
											</span>
											<div>
												<p className="text-sm font-bold text-slate-800">
													{review.name || "অজানা কাস্টমার"}
												</p>
												<p className="text-xs font-semibold text-rose-500">
													অভিযোগকারী
												</p>
											</div>
										</div>
										<time
											className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600"
											dateTime={review.created_at}
										>
											<CalendarDays className="size-3.5" aria-hidden="true" />
											{review.created_at ? formateDate(review.created_at) : ""}
										</time>
									</div>
									<p className="mt-3 rounded-r-lg border-l-2 border-rose-400 bg-white/60 py-1 pl-3 text-sm leading-6 text-slate-600">
										{review.comment}
									</p>
								</li>
							);
						})}
					</ul>
				</section>
			)}

			<div className="grid gap-4 lg:grid-cols-5">
				{/* Left: summary pie chart */}
				<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
					<h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
						Summary
					</h3>
					<PieChart
						value={summary?.success_ratio ?? 0}
						total={summary?.total_parcel}
					/>
					<div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
						<div className="rounded-xl bg-slate-50 p-3">
							<p className="text-xs font-semibold text-slate-500">
								Total parcels
							</p>
							<p className="mt-1 text-lg font-extrabold text-slate-800">
								{summary?.total_parcel ?? 0}
							</p>
						</div>
						<div className="rounded-xl bg-emerald-50 p-3">
							<p className="text-xs font-semibold text-emerald-600">Success</p>
							<p className="mt-1 text-lg font-extrabold text-emerald-700">
								{summary?.success_parcel ?? 0}
							</p>
						</div>
						<div className="rounded-xl bg-rose-50 p-3">
							<p className="text-xs font-semibold text-rose-500">Cancelled</p>
							<p className="mt-1 text-lg font-extrabold text-rose-600">
								{summary?.cancelled_parcel ?? 0}
							</p>
						</div>
						<div className="rounded-xl bg-teal-50 p-3">
							<p className="text-xs font-semibold text-teal-600">
								Success rate
							</p>
							<p className="mt-1 text-lg font-extrabold text-teal-700">
								{summary?.success_ratio ?? 0}%
							</p>
						</div>
					</div>
				</section>

				{/* Right: per-courier data */}
				<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
					<div className="overflow-x-auto px-2 pb-2">
						<table className="w-full min-w-[430px] text-left">
							<thead>
								<tr className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
									<th className="px-3 py-3">Courier</th>
									<th className="px-3 py-3 text-right">Total</th>
									<th className="px-3 py-3 text-right">Success</th>
									<th className="px-3 py-3 text-right">Cancel</th>
									<th className="px-3 py-3">Rate</th>
								</tr>
							</thead>
							<tbody>
								{couriers.map((courier) => (
									<CourierRow key={courier.name} courier={courier} />
								))}
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</div>
	);
}
