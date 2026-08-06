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
	const radius = 68;
	const circumference = 2 * Math.PI * radius;
	const successLength = total > 0 ? (success / total) * circumference : 0;
	const cancelledLength = total > 0 ? (cancelled / total) * circumference : 0;
	const center = { x: 130, y: 110 };
	const pointAt = (angle: number, distance: number) => {
		const radians = ((angle - 90) * Math.PI) / 180;
		return {
			x: center.x + Math.cos(radians) * distance,
			y: center.y + Math.sin(radians) * distance,
		};
	};
	const separatorAngles = [0, total > 0 ? (success / total) * 360 : 0];

	return (
		<div className="flex justify-center overflow-visible">
			<svg
				viewBox="0 0 260 220"
				role="img"
				aria-label={`Parcel summary: ${success} successful and ${cancelled} cancelled out of ${total}`}
				className="h-auto w-full max-w-[340px] overflow-visible"
			>
				<circle
					cx={center.x}
					cy={center.y}
					r={radius}
					fill="none"
					strokeWidth="30"
					className="stroke-slate-100"
				/>
				<circle
					cx={center.x}
					cy={center.y}
					r={radius}
					fill="none"
					strokeWidth="30"
					className={total > 0 ? "stroke-[#35aaa0]" : "stroke-slate-200"}
				/>
				{cancelledLength > 0 && (
					<>
						<circle
							cx={center.x}
							cy={center.y}
							r={radius}
							fill="none"
							strokeWidth="34"
							strokeDasharray={`${cancelledLength} ${circumference}`}
							strokeDashoffset={-successLength}
							transform={`rotate(-90 ${center.x} ${center.y})`}
							className="stroke-white"
						/>
						<circle
							cx={center.x}
							cy={center.y}
							r={radius}
							fill="none"
							strokeWidth="30"
							strokeDasharray={`${cancelledLength} ${circumference}`}
							strokeDashoffset={-successLength}
							transform={`rotate(-90 ${center.x} ${center.y})`}
							className="stroke-[#ef5350]"
						/>
					</>
				)}
				{cancelledLength > 0 &&
					separatorAngles.map((angle) => {
						const inner = pointAt(angle, radius - 16);
						const outer = pointAt(angle, radius + 16);
						return (
							<line
								key={angle}
								x1={inner.x}
								y1={inner.y}
								x2={outer.x}
								y2={outer.y}
								stroke="white"
								strokeWidth="4"
								strokeLinecap="round"
							/>
						);
					})}
				<circle cx={center.x} cy={center.y} r={radius - 15} fill="white" />
				<text
					x={center.x}
					y={center.y - 3}
					fill="#35aaa0"
					fontSize="30"
					fontWeight="800"
					textAnchor="middle"
				>
					{ratio}
					<tspan fontSize="14" dx="2">
						%
					</tspan>
				</text>
				<text
					x={center.x}
					y={center.y + 18}
					fill="#94a3b8"
					fontSize="10"
					fontWeight="600"
					textAnchor="middle"
				>
					{total} parcels
				</text>
			</svg>
		</div>
	);
}

function MiniRateChart({ rate }: { rate: number }) {
	const radius = 14;
	const circumference = 2 * Math.PI * radius;
	const successLength =
		(Math.max(0, Math.min(rate, 100)) / 100) * circumference;

	return (
		<div className="flex items-center gap-2">
			<svg
				viewBox="0 0 40 40"
				role="img"
				aria-label={`${rate}% success rate`}
				className="size-9 -rotate-90"
			>
				<circle
					cx="20"
					cy="20"
					r={radius}
					fill="none"
					strokeWidth="6"
					className="stroke-slate-100"
				/>
				<circle
					cx="20"
					cy="20"
					r={radius}
					fill="none"
					strokeWidth="6"
					strokeDasharray={`${successLength} ${circumference}`}
					className="stroke-[#35aaa0]"
				/>
			</svg>
			<span className="text-xs font-extrabold text-slate-700">{rate}%</span>
		</div>
	);
}

function CourierRow({ courier }: { courier: CourierStats }) {
	return (
		<tr className="border-t border-slate-100">
			<td className="px-3 py-3">
				<div className="flex min-w-32 items-center gap-2">
					<img
						src={courier.logo}
						alt=""
						loading="lazy"
						className="size-8 shrink-0 rounded-lg bg-slate-100 object-contain p-1"
					/>
					<span className="truncate text-sm font-bold text-slate-800">
						{courier.name}
					</span>
				</div>
			</td>
			<td className="px-3 py-3 text-right text-sm font-semibold text-slate-700">
				{courier.total_parcel}
			</td>
			<td className="px-3 py-3 text-right text-sm font-semibold text-emerald-600">
				{courier.success_parcel}
			</td>
			<td className="px-3 py-3 text-right text-sm font-semibold text-rose-500">
				{courier.cancelled_parcel}
			</td>
			<td className="px-3 py-3">
				<MiniRateChart rate={courier.success_ratio} />
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
					<DonutChart summary={summary} />
				</section>

				{/* Right: per-courier data */}
				<section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
					<h3 className="px-5 pt-5 text-sm font-bold uppercase tracking-wider text-slate-500">
						Couriers
					</h3>
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
