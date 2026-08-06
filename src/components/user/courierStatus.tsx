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
	const successPart = total > 0 ? success / total : 0;
	const cancelledPart = total > 0 ? cancelled / total : 0;
	const center = { x: 130, y: 110 };

	const pointAt = (angle: number, distance: number) => {
		const radians = ((angle - 90) * Math.PI) / 180;
		return {
			x: center.x + Math.cos(radians) * distance,
			y: center.y + Math.sin(radians) * distance,
		};
	};

	const labelLine = (angle: number, text: string, color: string) => {
		const start = pointAt(angle, radius + 16);
		const elbow = pointAt(angle, radius + 28);
		const rightSide = elbow.x >= center.x;
		const textX = rightSide ? 250 : 10;
		const textY = Math.max(18, Math.min(202, elbow.y));
		const lineEndX = rightSide ? textX - 4 : textX + 4;

		return (
			<g key={text}>
				<path
					d={`M ${start.x} ${start.y} L ${elbow.x} ${elbow.y} L ${lineEndX} ${textY}`}
					fill="none"
					stroke={color}
					strokeWidth="1.5"
				/>
				<text
					x={textX}
					y={textY + 4}
					fill={color}
					fontSize="11"
					fontWeight="700"
					textAnchor={rightSide ? "end" : "start"}
				>
					{text}
				</text>
			</g>
		);
	};

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
				<circle cx={center.x} cy={center.y} r={radius - 15} fill="white" />
				{total > 0 && (
					<>
						{labelLine(successPart * 180, `Success ${success}`, "#35aaa0")}
						{labelLine(
							successPart * 360 + cancelledPart * 180,
							`Cancelled ${cancelled}`,
							"#ef5350",
						)}
					</>
				)}
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
