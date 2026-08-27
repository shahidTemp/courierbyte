// @ts-nocheck
import {
	CheckCircle2,
	PackageSearch,
	Target,
	TrendingDown,
	WalletCards,
} from "lucide-react";

const valueFeatures = [
	{
		icon: PackageSearch,
		tag: "০১ · ঝুঁকি বুঝুন",
		title: "প্রতিটি গ্রাহক সম্পর্কে পরিষ্কার ধারণা পান",
		desc: "শুধু ‘ভালো’ বা ‘খারাপ’ নয়—কোন কুরিয়ারে তার কতগুলো পার্সেল ডেলিভারি হয়েছে, কতগুলো গ্রহণ করা হয়েছে এবং কোথায় সমস্যা হয়েছে, সবই দেখুন।",
		points: [
			"মোট অর্ডার ও সফল ডেলিভারির হিসাব",
			"বাতিল ও ফেরতের ইতিহাস",
			"সহজ ঝুঁকি-স্তর ও পরবর্তী করণীয়",
		],
	},
	{
		icon: WalletCards,
		tag: "০২ · লাভ বাঁচান",
		title: "রিপোর্ট শুধু তথ্য নয়—সঠিক সিদ্ধান্তের ভিত্তি",
		desc: "একটি ফেরতে কতটা খরচ হতে পারে, তা বুঝে আপনার টিমকে পরবর্তী পদক্ষেপ নিতে সাহায্য করুন।",
		points: [
			"সম্ভাব্য লোকসানের আগাম ধারণা",
			"সফল ডেলিভারির হার দেখে COD-এর সিদ্ধান্ত",
			"অর্ডার নিশ্চিত করার সহজ প্রক্রিয়া",
		],
	},
];

const barChart = [
	{ day: "শনি", height: 42 },
	{ day: "রবি", height: 58 },
	{ day: "সোম", height: 47 },
	{ day: "মঙ্গল", height: 72 },
	{ day: "বুধ", height: 66 },
	{ day: "বৃহঃ", height: 88 },
	{ day: "শুক্র", height: 79 },
];

function SavingsBoard() {
	return (
		<div className="relative w-full max-w-[550px]">
			<div className="absolute -inset-5 rounded-[2rem] bg-secondary/15 blur-2xl" />
			<div className="relative overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white p-5 shadow-2xl shadow-secondary/10 sm:p-6">
				<div className="flex items-center justify-between border-b border-slate-100 pb-4">
					<div className="flex items-center gap-3">
						<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
							<WalletCards className="h-5 w-5" />
						</span>
						<div>
							<p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
								ব্যবসার প্রভাব
							</p>
							<p className="mt-1 text-sm font-extrabold text-slate-900">
								লাভের হিসাব
							</p>
						</div>
					</div>
					<span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-bold text-secondary">
						নমুনা
					</span>
				</div>
				<div className="mt-5 grid grid-cols-2 gap-3">
					<div className="rounded-xl bg-slate-50 p-4">
						<p className="text-[10px] font-semibold text-slate-400">
							যাচাই না করলে
						</p>
						<p className="mt-2 text-2xl font-extrabold text-rose-500">-৳ ৩৫০</p>
						<p className="mt-1 text-[10px] text-slate-500">সম্ভাব্য ফেরতের খরচ</p>
					</div>
					<div className="rounded-xl bg-secondary/10 p-4">
						<p className="text-[10px] font-semibold text-secondary/60">
							যাচাই করলে
						</p>
						<p className="mt-2 text-2xl font-extrabold text-secondary">
							+৳ ৩৫০
						</p>
						<p className="mt-1 text-[10px] text-secondary/60">লাভ বাঁচানোর সুযোগ</p>
					</div>
				</div>
				<div className="mt-5 rounded-xl border border-slate-100 p-4">
					<div className="flex items-center justify-between">
						<p className="text-xs font-extrabold text-slate-800">
							মাসিক ফেরত কমানোর সম্ভাবনা
						</p>
						<TrendingDown className="h-4 w-4 text-secondary" />
					</div>
					<div className="mt-5 flex h-28 items-end gap-2 sm:gap-3">
						{barChart.map((bar) => (
							<div
								key={bar.day}
								className="flex flex-1 flex-col items-center gap-2"
							>
								<div
									className={`w-full rounded-t-md ${bar.day === "শুক্র" ? "bg-secondary" : "bg-secondary/10"}`}
									style={{ height: `${bar.height}%` }}
								/>
								<span className="text-[9px] font-medium text-slate-400">
									{bar.day}
								</span>
							</div>
						))}
					</div>
				</div>
				<div className="mt-4 flex items-center gap-2 rounded-xl bg-secondary/10 px-3 py-3 text-[11px] font-bold text-secondary-dark">
					<Target className="h-4 w-4 shrink-0 text-secondary" /> প্রতিটি সঠিক
					সিদ্ধান্ত আপনার লাভ রক্ষা করে
				</div>
			</div>
		</div>
	);
}

export default function FeatureShowcase() {
	return (
		<section id="features" className="section-pad bg-night text-white">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
						আপনার ব্যবসায় বাস্তব প্রভাব
					</p>
					<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
						শুধু ফিচার দেখানোর জন্য নয়,
						<br className="hidden sm:block" /> সিদ্ধান্ত সহজ করার জন্য তৈরি
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
						সুন্দর ড্যাশবোর্ডের পেছনে আছে আপনার সময়, পণ্য ও লাভ রক্ষার একটি বাস্তবসম্মত
						প্রক্রিয়া।
					</p>
				</div>
				<div className="mt-16 space-y-20">
					{valueFeatures.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<div
								key={feature.tag}
								className={`grid items-center gap-12 lg:grid-cols-2 ${index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""}`}
							>
								<div>
									<span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-2 text-xs font-bold text-accent shadow-sm">
										<Icon className="h-3.5 w-3.5" /> {feature.tag}
									</span>
									<h3 className="mt-5 text-3xl font-extrabold leading-tight text-white">
										{feature.title}
									</h3>
									<p className="mt-4 max-w-lg text-base leading-relaxed text-white/60">
										{feature.desc}
									</p>
									<ul className="mt-7 space-y-3">
										{feature.points.map((point) => (
											<li
												key={point}
												className="flex items-center gap-2.5 text-sm font-semibold text-white/75"
											>
												<CheckCircle2 className="h-5 w-5 text-accent" />{" "}
												{point}
											</li>
										))}
									</ul>
								</div>
								<div className="relative">
									{index === 0 ? (
										<img
											src="/images/dashboard.png"
											alt="CourierByte dashboard preview"
											className="w-full rounded-[1.35rem] shadow-2xl shadow-secondary/10"
										/>
									) : (
										<SavingsBoard />
									)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
