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
		name: "পাথাও",
		count: "১৪টি",
		delivered: "১২",
		rate: 86,
		logo: "/images/pathao.png",
		accent: "text-orange-300",
		chipRing: "ring-orange-400/40",
		bar: "bg-gradient-to-r from-orange-400 to-amber-300",
	},
	{
		name: "স্টেডফাস্ট",
		count: "৯টি",
		delivered: "৮",
		rate: 89,
		logo: "/images/steadfast.png",
		accent: "text-sky-300",
		chipRing: "ring-sky-400/40",
		bar: "bg-gradient-to-r from-sky-400 to-cyan-300",
	},
	{
		name: "RedX",
		count: "৭টি",
		delivered: "৪",
		rate: 57,
		logo: "/images/redx.png",
		accent: "text-rose-300",
		chipRing: "ring-rose-400/40",
		bar: "bg-gradient-to-r from-rose-400 to-red-300",
	},
	{
		name: "Carrybee",
		count: "৬টি",
		delivered: "৫",
		rate: 83,
		logo: "/images/carrybee.png",
		accent: "text-violet-300",
		chipRing: "ring-violet-400/40",
		bar: "bg-gradient-to-r from-violet-400 to-fuchsia-300",
	},
];

const statCards = [
	{
		label: "মোট পার্সেল",
		value: "৩৬",
		sub: "সব কুরিয়ার",
		icon: Package,
		card: "border-white/15 bg-gradient-to-br from-white/10 to-white/[0.02]",
		iconWrap: "bg-white/15 text-white",
		valueCls: "text-xl text-white",
		labelCls: "text-slate-400",
		subCls: "text-slate-500",
	},
	{
		label: "রিসিভ করেছে",
		value: "২৯",
		sub: "সফল ডেলিভারি",
		icon: CheckCircle2,
		card: "border-emerald-400/30 bg-gradient-to-br from-emerald-400/20 to-teal-400/[0.07]",
		iconWrap: "bg-emerald-400/20 text-emerald-300",
		valueCls: "text-xl text-emerald-300",
		labelCls: "text-emerald-200/70",
		subCls: "text-emerald-200/50",
	},
	{
		label: "ক্যানসেল",
		value: "৭",
		sub: "রিফিউজ / রিটার্ন",
		icon: XCircle,
		card: "border-rose-400/30 bg-gradient-to-br from-rose-400/20 to-red-400/[0.07]",
		iconWrap: "bg-rose-400/20 text-rose-300",
		valueCls: "text-xl text-rose-300",
		labelCls: "text-rose-200/70",
		subCls: "text-rose-200/50",
	},
	{
		label: "রিস্ক স্কোর",
		value: "মাঝারি",
		sub: "সতর্ক থাকুন",
		icon: ShieldAlert,
		card: "border-amber-400/30 bg-gradient-to-br from-amber-400/20 to-orange-400/[0.07]",
		iconWrap: "bg-amber-400/20 text-amber-300",
		valueCls: "text-lg text-amber-300",
		labelCls: "text-amber-200/70",
		subCls: "text-amber-200/50",
	},
];

export default function MiniDashboard({ large = false }: { large?: boolean }) {
	return (
		<div className={`relative ${large ? "w-full" : "w-full max-w-[550px]"}`}>
			{/* colorful ambient glow */}
			<div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-violet-500/30 via-cyan-400/15 to-amber-400/25 blur-2xl" />

			<div className="relative overflow-hidden rounded-[1.35rem] border border-white/15 bg-[#0e1430] shadow-[0_30px_90px_rgba(20,10,70,0.45)]">
				{/* inner color blobs */}
				<div aria-hidden className="pointer-events-none absolute inset-0">
					<div className="absolute -left-14 -top-16 h-48 w-48 rounded-full bg-violet-600/30 blur-3xl" />
					<div className="absolute -right-12 top-16 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl" />
					<div className="absolute bottom-0 left-1/4 h-44 w-44 rounded-full bg-fuchsia-500/15 blur-3xl" />
					<div className="absolute -bottom-10 right-6 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl" />
				</div>
				{/* glass top highlight */}
				<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

				{/* header */}
				<div className="relative flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-[#1c1145]/90 via-[#101638]/90 to-[#0d2a2c]/90 px-4 py-3 backdrop-blur sm:px-5">
					<div className="flex items-center gap-2.5">
						<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-white shadow-lg shadow-fuchsia-500/40">
							<PackageSearch className="h-4 w-4" />
						</span>
						<div>
							<p className="text-[9px] font-bold uppercase tracking-[0.16em] text-fuchsia-200/70">
								CourierByte
							</p>
							<p className="bg-gradient-to-r from-white via-emerald-100 to-cyan-100 bg-clip-text text-xs font-semibold text-transparent">
								কাস্টমার ইনসাইট
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<span className="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 sm:flex">
							<span className="relative flex h-1.5 w-1.5">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
								<span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
							</span>
							Live data preview
						</span>
						<span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-400/70 to-fuchsia-500/70 text-[10px] font-bold text-white ring-1 ring-white/25">
							AR
						</span>
					</div>
				</div>

				{/* body */}
				<div className="relative space-y-4 p-4 sm:p-5">
					{/* searched number */}
					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-3">
							<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/80 to-fuchsia-500/80 text-white shadow-md shadow-fuchsia-500/30">
								<Phone className="h-4 w-4" />
							</span>
							<div>
								<p className="text-[10px] font-medium text-slate-400">
									সার্চ করা নাম্বার
								</p>
								<p className="mt-1 text-sm font-bold tracking-wide text-white">
									017•••••••21
								</p>
							</div>
						</div>
						<span className="flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
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
									className={`rounded-xl border p-3 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 ${card.card}`}
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
						<div className="rounded-xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-sm">
							<div className="mb-4 flex items-center justify-between">
								<p className="flex items-center gap-2 text-xs font-bold text-white">
									<span className="h-2 w-2 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.9)]" />
									কুরিয়ারভিত্তিক হিস্ট্রি
								</p>
								<span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] font-semibold text-slate-300 ring-1 ring-white/10">
									Last 90 days
								</span>
							</div>
							<div className="space-y-3.5">
								{courierRows.map((row) => (
									<div key={row.name} className="group">
										<div className="mb-1.5 flex items-center justify-between text-[10px]">
											<span className="flex items-center gap-2 font-semibold text-slate-200">
												<img
													src={row.logo}
													alt={row.name}
													loading="lazy"
													className={`h-6 w-6 rounded-md bg-white object-contain p-0.5 shadow-sm ring-1 transition-transform duration-200 group-hover:scale-110 ${row.chipRing}`}
												/>
												{row.name}
												<span className="font-normal text-slate-400">
													{row.count}
												</span>
											</span>
											<span className={`font-bold ${row.accent}`}>
												{row.delivered}/{row.count.replace("টি", "")} —{" "}
												{row.rate}%
											</span>
										</div>
										<div className="h-1.5 overflow-hidden rounded-full bg-white/10">
											<div
												className={`h-full rounded-full ${row.bar}`}
												style={{ width: `${row.rate}%` }}
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="flex flex-col justify-between rounded-xl border border-amber-400/25 bg-gradient-to-br from-amber-400/[0.18] via-orange-400/[0.1] to-rose-400/[0.08] p-4">
							<div>
								<div className="flex items-center justify-between">
									<p className="text-xs font-bold text-white">সিদ্ধান্তের ইঙ্গিত</p>
									<span className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-400/20 text-amber-300">
										<ShieldAlert className="h-3.5 w-3.5" />
									</span>
								</div>
								<p className="mt-3 text-xs leading-relaxed text-amber-100/80">
									এই কাস্টমারের রিস্ক মাঝারি। COD পাঠালে কনফার্মেশন কল করুন।
								</p>
							</div>
							<div className="mt-5 flex items-end justify-between gap-3">
								<div>
									<p className="text-[10px] text-amber-200/60">
										সম্ভাব্য সাশ্রয় <span className="font-normal">(উদাহরণ)</span>
									</p>
									<p className="mt-1 bg-gradient-to-r from-amber-200 via-orange-200 to-rose-200 bg-clip-text text-xl font-extrabold text-transparent">
										৳ ১,৮০০
									</p>
								</div>
								<span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-300 shadow-[0_0_18px_rgba(252,211,77,0.25)]">
									<WalletCards className="h-5 w-5" />
								</span>
							</div>
						</div>
					</div>

					{/* footer strip */}
					<div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-gradient-to-r from-violet-500/[0.18] via-fuchsia-400/[0.1] to-amber-400/[0.18] px-4 py-3">
						<div className="flex items-center gap-2.5">
							<span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md shadow-fuchsia-500/30">
								<Zap className="h-3.5 w-3.5" />
							</span>
							<p className="text-[10px] font-semibold text-white/80">
								রিপোর্ট তৈরি হয়েছে ০.৮ সেকেন্ডে
							</p>
						</div>
						<span className="flex items-center gap-1 text-[10px] font-bold text-emerald-300">
							<Sparkles className="h-3 w-3" /> নিরাপদ ও গোপনীয়
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
