import {
	BadgeCheck,
	PackageSearch,
	ShieldAlert,
	Truck,
	WalletCards,
	Zap,
} from "lucide-react";

const courierRows = [
	{ name: "পাথাও", count: "১৪টি", delivered: "১২", rate: 86, tone: "emerald" },
	{ name: "স্টেডফাস্ট", count: "৯টি", delivered: "৮", rate: 89, tone: "teal" },
	{ name: "RedX", count: "৭টি", delivered: "৪", rate: 57, tone: "amber" },
];

export default function MiniDashboard({ large = false }: { large?: boolean }) {
	return (
		<div className={`relative ${large ? "w-full" : "w-full max-w-[550px]"}`}>
			<div className="absolute -inset-5 rounded-[2rem] bg-emerald-400/10 blur-2xl" />
			<div className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-[#102a25] shadow-[0_30px_80px_rgba(6,48,37,0.28)]">
				<div className="flex items-center justify-between border-b border-white/10 bg-[#0c211d] px-4 py-3 sm:px-5">
					<div className="flex items-center gap-2.5">
						<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
							<PackageSearch className="h-4 w-4" />
						</span>
						<div>
							<p className="text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300/60">
								CourierByte
							</p>
							<p className="text-xs font-semibold text-white">কাস্টমার ইনসাইট</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<span className="hidden items-center gap-1.5 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 sm:flex">
							<span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
							data preview
						</span>
						<span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
							AR
						</span>
					</div>
				</div>

				<div className="space-y-4 p-4 sm:p-5">
					<div className="flex items-center justify-between gap-3">
						<div>
							<p className="text-[10px] font-medium text-slate-400">
								সার্চ করা নাম্বার
							</p>
							<p className="mt-1 text-sm font-bold tracking-wide text-white">
								017•••••••21
							</p>
						</div>
						<span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
							<BadgeCheck className="h-3.5 w-3.5" /> যাচাই করা হয়েছে
						</span>
					</div>

					<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
						<div className="rounded-xl border border-white/10 bg-white/[0.045] p-3">
							<p className="text-[10px] text-slate-400">মোট পার্সেল</p>
							<p className="mt-1 text-xl font-extrabold text-white">৩০</p>
							<p className="mt-1 text-[9px] font-medium text-slate-500">
								সব কুরিয়ার
							</p>
						</div>
						<div className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] p-3">
							<p className="text-[10px] text-emerald-200/70">রিসিভ করেছে</p>
							<p className="mt-1 text-xl font-extrabold text-emerald-300">২৪</p>
							<p className="mt-1 text-[9px] font-medium text-emerald-200/50">
								সফল ডেলিভারি
							</p>
						</div>
						<div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-3">
							<p className="text-[10px] text-rose-200/70">ক্যানসেল</p>
							<p className="mt-1 text-xl font-extrabold text-rose-300">৬</p>
							<p className="mt-1 text-[9px] font-medium text-rose-200/50">
								রিফিউজ / রিটার্ন
							</p>
						</div>
						<div className="rounded-xl border border-amber-400/20 bg-amber-400/[0.08] p-3">
							<p className="text-[10px] text-amber-200/70">রিস্ক স্কোর</p>
							<p className="mt-1 text-xl font-extrabold text-amber-300">মাঝারি</p>
							<p className="mt-1 text-[9px] font-medium text-amber-200/50">
								সতর্ক থাকুন
							</p>
						</div>
					</div>

					<div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
						<div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
							<div className="mb-4 flex items-center justify-between">
								<p className="text-xs font-bold text-white">
									কুরিয়ারভিত্তিক হিস্ট্রি
								</p>
								<span className="text-[10px] text-slate-500">Last 90 days</span>
							</div>
							<div className="space-y-3.5">
								{courierRows.map((row) => (
									<div key={row.name}>
										<div className="mb-1.5 flex items-center justify-between text-[10px]">
											<span className="flex items-center gap-1.5 font-semibold text-slate-300">
												<Truck className="h-3.5 w-3.5 text-emerald-400" />{" "}
												{row.name}
												<span className="font-normal text-slate-500">
													{row.count}
												</span>
											</span>
											<span className="font-bold text-slate-300">
												{row.delivered}/{row.count.replace("টি", "")} —{" "}
												{row.rate}%
											</span>
										</div>
										<div className="h-1.5 overflow-hidden rounded-full bg-white/10">
											<div
												className={`h-full rounded-full ${
													row.tone === "amber"
														? "bg-amber-400"
														: "bg-emerald-400"
												}`}
												style={{ width: `${row.rate}%` }}
											/>
										</div>
									</div>
								))}
							</div>
						</div>

						<div className="flex flex-col justify-between rounded-xl border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.12] to-orange-400/[0.06] p-4">
							<div>
								<div className="flex items-center justify-between">
									<p className="text-xs font-bold text-white">সিদ্ধান্তের ইঙ্গিত</p>
									<ShieldAlert className="h-4 w-4 text-amber-300" />
								</div>
								<p className="mt-3 text-xs leading-relaxed text-amber-100/80">
									এই কাস্টমারের রিস্ক মাঝারি। COD পাঠালে কনফার্মেশন কল করুন।
								</p>
							</div>
							<div className="mt-5 flex items-end justify-between gap-3">
								<div>
									{" "}
									<p className="text-[10px] text-amber-200/60">
										সম্ভাব্য সাশ্রয় <span className="font-normal">(উদাহরণ)</span>
									</p>
									<p className="mt-1 text-xl font-extrabold text-white">
										৳ ১,৮০০
									</p>
								</div>
								<span className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-300">
									<WalletCards className="h-5 w-5" />
								</span>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between rounded-xl border border-emerald-400/20 bg-emerald-400/[0.08] px-4 py-3">
						<div className="flex items-center gap-2.5">
							<span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-300">
								<Zap className="h-3.5 w-3.5" />
							</span>
							<p className="text-[10px] font-semibold text-emerald-100/80">
								রিপোর্ট তৈরি হয়েছে ০.৮ সেকেন্ডে
							</p>
						</div>
						<span className="text-[10px] font-bold text-emerald-300">
							নিরাপদ ও গোপনীয়
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
