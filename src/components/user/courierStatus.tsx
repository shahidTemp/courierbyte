import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react";
import { PieChart } from "@/components/user/pieChart";

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

type RiskVerdict = {
	label?: string;
	action?: string;
	color?: string;
	reasons?: string[];
};

export type FraudResult = {
	status?: string;
	data?: Record<string, CourierStats> & { summary?: SummaryStats };
	reports?: unknown[];
	risk_verdict?: RiskVerdict;
};

const RISK_STYLES: Record<string, { badge: string; icon: typeof ShieldAlert }> =
	{
		green: { badge: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
		amber: { badge: "bg-amber-100 text-amber-700", icon: ShieldAlert },
		red: { badge: "bg-rose-100 text-rose-700", icon: XCircle },
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
						className="h-16 w-28 shrink-0 rounded-2xl bg-slate-100 object-contain p-2"
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
	const { data = {}, risk_verdict } = result;
	const { summary, ...courierMap } = data;
	const couriers = Object.values(courierMap).sort(
		(a, b) => b.total_parcel - a.total_parcel,
	);

	const style = RISK_STYLES[risk_verdict?.color ?? ""] ?? RISK_STYLES.amber;
	const VerdictIcon = style.icon;

	return (
		<div className="mt-6 space-y-4">
			{/* Risk verdict header */}
			<div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
				<div className="flex items-center gap-3">
					<span
						className={`flex size-11 items-center justify-center rounded-xl ${style.badge}`}
					>
						<VerdictIcon className="size-6" aria-hidden="true" />
					</span>
					<div>
						<p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
							Risk verdict
						</p>
						<p className="text-lg font-extrabold text-slate-900">
							{risk_verdict?.label ?? "Unknown"}
						</p>
					</div>
				</div>
				<div className="text-sm">
					{risk_verdict?.action && (
						<p className="font-semibold text-slate-800">
							{risk_verdict.action}
						</p>
					)}
					{risk_verdict?.reasons?.map((reason) => (
						<p key={reason} className="text-xs text-slate-500">
							• {reason}
						</p>
					))}
				</div>
			</div>

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
