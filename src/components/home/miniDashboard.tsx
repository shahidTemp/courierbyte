import {
	BadgeCheck,
	CheckCircle2,
	Package,
	PackageSearch,
	Phone,
	ShieldAlert,
	Sparkles,
	WalletCards,
	XCircle,
	Zap,
} from "lucide-react";

const courierRows = [
	{
		name: "Pathao",
		count: "১৪টি",
		delivered: "১২",
		rate: 86,
		logo: "/images/pathao.png",
		accent: "text-orange-600",
		chipRing: "ring-orange-300/60",
		bar: "bg-gradient-to-r from-orange-500 to-amber-400",
	},
	{
		name: "Steadfast",
		count: "৯টি",
		delivered: "৮",
		rate: 89,
		logo: "/images/steadfast.png",
		accent: "text-sky-600",
		chipRing: "ring-sky-300/60",
		bar: "bg-gradient-to-r from-sky-500 to-cyan-400",
	},
	{
		name: "RedX",
		count: "৭টি",
		delivered: "৪",
		rate: 57,
		logo: "/images/redx.png",
		accent: "text-rose-600",
		chipRing: "ring-rose-300/60",
		bar: "bg-gradient-to-r from-rose-500 to-red-400",
	},
	{
		name: "Carrybee",
		count: "৬টি",
		delivered: "৫",
		rate: 83,
		logo: "/images/carrybee.png",
		accent: "text-indigo-600",
		chipRing: "ring-indigo-300/60",
		bar: "bg-gradient-to-r from-indigo-500 to-blue-400",
	},
];

const statCards = [
	{
		label: "মোট পার্সেল",
		value: "৩৬",
		sub: "সব কুরিয়ার",
		icon: Package,
		card: "border-gray-200 bg-white shadow-sm",
		iconWrap: "bg-blue-100 text-blue-600",
		valueCls: "text-xl text-gray-900",
		labelCls: "text-gray-500",
		subCls: "text-gray-400",
	},
	{
		label: "রিসিভ করেছে",
		value: "২৯",
		sub: "সফল ডেলিভারি",
		icon: CheckCircle2,
		card: "border-emerald-200 bg-emerald-50/60",
		iconWrap: "bg-emerald-100 text-emerald-600",
		valueCls: "text-xl text-emerald-700",
		labelCls: "text-emerald-600/70",
		subCls: "text-emerald-500/70",
	},
	{
		label: "ক্যানসেল",
		value: "৭",
		sub: "রিফিউজ / রিটার্ন",
		icon: XCircle,
		card: "border-rose-200 bg-rose-50/60",
		iconWrap: "bg-rose-100 text-rose-600",
		valueCls: "text-xl text-rose-700",
		labelCls: "text-rose-600/70",
		subCls: "text-rose-500/70",
	},
	{
		label: "রিস্ক স্কোর",
		value: "মাঝারি",
		sub: "সতর্ক থাকুন",
		icon: ShieldAlert,
		card: "border-amber-200 bg-amber-50/60",
		iconWrap: "bg-amber-100 text-amber-600",
		valueCls: "text-lg text-amber-700",
		labelCls: "text-amber-600/70",
		subCls: "text-amber-500/70",
	},
];

export default function MiniDashboard({ large = false }: { large?: boolean }) {
	return (
		<div className={`relative ${large ? "w-full" : "w-full max-w-[550px]"}`}>
			<div className="relative overflow-hidden rounded-[1.35rem] border border-gray-200 bg-white shadow-[0_4px_30px_rgba(0,0,0,0.08)]">
				{/* inner color accents — single subtle glow to avoid GPU overload */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 overflow-hidden"
				>
					<div className="absolute -left-10 -top-12 h-40 w-40 rounded-full bg-blue-400/15 blur-xl" />
					<div className="absolute -right-8 bottom-8 h-36 w-36 rounded-full bg-cyan-400/10 blur-xl" />
				</div>
				{/* glass top highlight */}
				<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

				{/* header */}
				<div className="relative flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-blue-50 via-white to-cyan-50 px-4 py-3 sm:px-5">
					<div className="flex items-center gap-2.5">
						<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400 text-white shadow-md shadow-cyan-400/30">
							<PackageSearch className="h-4 w-4" />
						</span>
						<div>
							<p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-500">
								CourierByte
							</p>
							<p className="text-xs font-semibold text-gray-700">কাস্টমার ইনসাইট</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<span className="hidden items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600 sm:flex">
							<span className="relative flex h-1.5 w-1.5">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
								<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
							</span>
							Live data preview
						</span>
						<span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 text-[10px] font-bold text-white">
							AR
						</span>
					</div>
				</div>

				{/* body */}
				<div className="relative space-y-4 p-4 sm:p-5">
					{/* searched number */}
					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-3">
							<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/80 to-cyan-500/80 text-white shadow-md shadow-cyan-500/30">
								<Phone className="h-4 w-4" />
							</span>
							<div>
								<p className="text-[10px] font-medium text-gray-500">
									সার্চ করা নাম্বার
								</p>
								<p className="mt-1 text-sm font-bold tracking-wide text-gray-900">
									017•••••••21
								</p>
							</div>
						</div>
						<span className="flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
							<BadgeCheck className="h-3.5 w-3.5" /> যাচাই করা হয়েছে
						</span>
					</div>

					{/* stat cards */}
					<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
						{statCards.map((card) => {
							const Icon = card.icon;
							return (
								<div
									key={card.label}
									className={`rounded-xl border p-3 transition-transform duration-200 hover:-translate-y-0.5 ${card.card}`}
								>
									<div className="flex items-center justify-between gap-1">
										<p className={`text-[10px] ${card.labelCls}`}>
											{card.label}
										</p>
										<span
											className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${card.iconWrap}`}
										>
											<Icon className="h-3.5 w-3.5" />
										</span>
									</div>
									<p className={`mt-1.5 font-extrabold ${card.valueCls}`}>
										{card.value}
									</p>
									<p className={`mt-1 text-[9px] font-medium ${card.subCls}`}>
										{card.sub}
									</p>
								</div>
							);
						})}
					</div>

					{/* courier history + decision */}
					<div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
						<div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
							<div className="mb-4 flex items-center justify-between">
								<p className="flex items-center gap-2 text-xs font-bold text-gray-800">
									<span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
									কুরিয়ারভিত্তিক হিস্ট্রি
								</p>
								<span className="rounded-full bg-gray-200 px-2 py-0.5 text-[9px] font-semibold text-gray-500">
									Last 90 days
								</span>
							</div>
							<div className="space-y-3.5">
								{courierRows.map((row) => (
									<div key={row.name} className="group">
										<div className="mb-1.5 flex items-center justify-between text-[10px]">
											<span className="flex items-center gap-2 font-semibold text-gray-700">
												<img
													src={row.logo}
													alt={row.name}
													loading="lazy"
													className={`h-6 w-6 rounded-md bg-white object-contain p-0.5 shadow-sm ring-1 transition-transform duration-200 group-hover:scale-110 ${row.chipRing}`}
												/>
												{row.name}
												<span className="font-normal text-gray-400">
													{row.count}
												</span>
											</span>
											<span className={`font-bold ${row.accent}`}>
												{row.delivered}/{row.count.replace("টি", "")} —{" "}
												{row.rate}%
											</span>
										</div>
										<div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
											<div
												className={`h-full rounded-full ${row.bar}`}
												style={{ width: `${row.rate}%` }}
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="flex flex-col justify-between rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 p-4">
							<div>
								<div className="flex items-center justify-between">
									<p className="text-xs font-bold text-gray-800">
										সিদ্ধান্তের ইঙ্গিত
									</p>
									<span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-600">
										<ShieldAlert className="h-3.5 w-3.5" />
									</span>
								</div>
								<p className="mt-3 text-xs leading-relaxed text-amber-800">
									এই কাস্টমারের রিস্ক মাঝারি। COD পাঠালে কনফার্মেশন কল করুন।
								</p>
							</div>
							<div className="mt-5 flex items-end justify-between gap-3">
								<div>
									<p className="text-[10px] text-amber-600/70">
										সম্ভাব্য সাশ্রয় <span className="font-normal">(উদাহরণ)</span>
									</p>
									<p className="mt-1 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-xl font-extrabold text-transparent">
										৳ ১,৮০০
									</p>
								</div>
								<span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300 bg-amber-100 text-amber-600 shadow-[0_0_18px_rgba(251,191,36,0.25)]">
									<WalletCards className="h-5 w-5" />
								</span>
							</div>
						</div>
					</div>

					{/* footer strip */}
					<div className="relative flex items-center justify-between rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 via-cyan-50 to-amber-50 px-4 py-3">
						<div className="flex items-center gap-2.5">
							<span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-md shadow-cyan-400/30">
								<Zap className="h-3.5 w-3.5" />
							</span>
							<p className="text-[10px] font-semibold text-gray-600">
								রিপোর্ট তৈরি হয়েছে ০.৮ সেকেন্ডে
							</p>
						</div>
						<span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
							<Sparkles className="h-3 w-3" /> নিরাপদ ও গোপনীয়
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
