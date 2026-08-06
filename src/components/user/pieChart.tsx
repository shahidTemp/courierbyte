type PieChartProps = {
	value: number;
	total?: number;
	size?: "large" | "small";
};

export function PieChart({ value, total, size = "large" }: PieChartProps) {
	const percentage = Math.max(0, Math.min(value, 100));
	const hasData = total === undefined || total > 0;
	const radius = 68;
	const circumference = 2 * Math.PI * radius;
	const successLength = (percentage / 100) * circumference;
	const cancelledLength = hasData
		? ((100 - percentage) / 100) * circumference
		: 0;
	const isSmall = size === "small";
	const center = { x: 110, y: 110 };

	const pointAt = (angle: number, distance: number) => {
		const radians = ((angle - 90) * Math.PI) / 180;
		return {
			x: center.x + Math.cos(radians) * distance,
			y: center.y + Math.sin(radians) * distance,
		};
	};

	const separatorAngles =
		hasData && percentage > 0 && percentage < 100 ? [0, percentage * 3.6] : [];

	return (
		<svg
			viewBox="0 0 220 220"
			role="img"
			aria-label={`${percentage}% success rate`}
			className={isSmall ? "size-16 shrink-0" : "h-auto w-full max-w-[340px]"}
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
				className={
					hasData && percentage > 0 ? "stroke-[#35aaa0]" : "stroke-slate-200"
				}
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
			{separatorAngles.map((angle) => {
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
				y={center.y}
				fill="#35aaa0"
				fontSize={isSmall ? 16 : 30}
				fontWeight="800"
				textAnchor="middle"
				dominantBaseline="middle"
			>
				{percentage}
				<tspan fontSize={isSmall ? 8 : 14} dx="1">
					%
				</tspan>
			</text>
		</svg>
	);
}
