import { CheckCircle2, ShieldAlert, XCircle } from "lucide-react";

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

function DonutChart({ summary }: { summary?: SummaryStats }) {
	const total = summary?.total_parcel ?? 0;
	const success = summary?.success_parcel ?? 0;
	const cancelled = summary?.cancelled_parcel ?? 0;
	const ratio = summary?.success_ratio ?? 0;

	const R = 42;
	const C = 2 * Math.PI * R;
	const successLen = total > 0 ? (success / total) * C : 0;
	const cancelledLen = total > 0 ? (cancelled / total) * C : 0;

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="relative">
				<svg
					viewBox="0 0 120 120"
					role="img"
					aria-label="Success versus cancelled parcels"
					className="size-40 -rotate-90"
				>
					<circle
						cx="60"
						cy="60"
						r={R}
						fill="none"
						strokeWidth="14"
						className="stroke-slate-100"
					/>
					<circle
						cx="60"
						cy="60"
						r={R}
						fill="none"
						strokeWidth="14"
						strokeLinecap="round"
						strokeDasharray={`${successLen} ${C}`}
						className="stroke-emerald-500"
					/>
					<circle
						cx="60"
						cy="60"
						r={R}
						fill="none"
						strokeWidth="14"
						strokeLinecap="round"
						strokeDasharray={`${cancelledLen} ${C}`}
						strokeDashoffset={-successLen}
						className="stroke-rose-500"
					/>
				</svg>
				<div className="absolute inset-0 flex flex-col items-center justify-center">
					<span className="text-2xl font-extrabold text-slate-900">
						{ratio}%
					</span>
					<span className="text-xs font-medium text-slate-500">
						{total} parcels
					</span>
				</div>
			</div>
			<div className="flex gap-4 text-sm">
				<span className="flex items-center gap-1.5 font-semibold text-slate-700">
					<span
						className="size-2.5 rounded-full bg-emerald-500"
						aria-hidden="true"
					/>
					Success {success}
				</span>
				<span className="flex items-center gap-1.5 font-semibold text-slate-700">
					<span
						className="size-2.5 rounded-full bg-rose-500"
						aria-hidden="true"
					/>
					Cancelled {cancelled}
				</span>
			</div>
		</div>
	);
}

function CourierRow({ courier }: { courier: CourierStats }) {
	const successPct =
		courier.total_parcel > 0
			? (courier.success_parcel / courier.total_parcel) * 100
			: 0;
	const cancelledPct =
		courier.total_parcel > 0
			? (courier.cancelled_parcel / courier.total_parcel) * 100
			: 0;

	return (
		<li className="flex items-center gap-3">
			<img
				src={courier.logo}
				alt={courier.name}
				loading="lazy"
				className="size-10 shrink-0 rounded-lg bg-slate-100 object-contain p-1.5"
			/>
			<div className="min-w-0 flex-1">
				<div className="flex items-baseline justify-between gap-2">
					<span className="truncate text-sm font-bold text-slate-800">
						{courier.name}
					</span>
					<span className="text-sm font-extrabold text-slate-900">
						{courier.success_ratio}%
					</span>
				</div>
				<div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-slate-100">
					<span
						className="bg-emerald-500"
						style={{ width: `${successPct}%` }}
					/>
					<span className="bg-rose-400" style={{ width: `${cancelledPct}%` }} />
				</div>
				<p className="mt-1 text-xs text-slate-500">
					{courier.success_parcel} success · {courier.cancelled_parcel}{" "}
					cancelled · {courier.total_parcel} total
				</p>
			</div>
		</li>
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
					<DonutChart summary={summary} />
				</section>

				{/* Right: per-courier data */}
				<section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3">
					<h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
						Couriers
					</h3>
					<ul className="space-y-4">
						{couriers.map((courier) => (
							<CourierRow key={courier.name} courier={courier} />
						))}
					</ul>
				</section>
			</div>
		</div>
	);
}
