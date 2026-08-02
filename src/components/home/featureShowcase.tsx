import {
	CheckCircle2,
	PackageSearch,
	Target,
	TrendingDown,
	WalletCards,
} from "lucide-react";
import MiniDashboard from "./miniDashboard";

const valueFeatures = [
	{
		icon: PackageSearch,
		tag: "01 · ঝুঁকি বোঝা",
		title: "প্রতিটি কাস্টমারের জন্য একটি পরিষ্কার উত্তর",
		desc: "শুধু ‘ভালো’ বা ‘খারাপ’ নয় — কোন কুরিয়ারে কতবার নিয়েছে, কতবার রিসিভ করেছে, কোথায় সমস্যা হয়েছে সব দেখুন।",
		points: [
			"মোট অর্ডার বনাম সফল ডেলিভারি",
			"ক্যানসেল ও রিটার্নের ইতিহাস",
			"সহজ Risk level ও action hint",
		],
	},
	{
		icon: WalletCards,
		tag: "02 · লাভ রক্ষা",
		title: "রিপোর্ট শুধু তথ্য নয় — টাকার সিদ্ধান্ত",
		desc: "একটি রিটার্নে কত খরচ হতে পারে, সেই হিসাব মাথায় রেখেই আপনার টিমকে পরবর্তী পদক্ষেপ বুঝিয়ে দিন।",
		points: [
			"সম্ভাব্য লোকসানের ইঙ্গিত",
			"সাকসেস রেশিও দেখে COD সিদ্ধান্ত",
			"অর্ডার কনফার্মেশন workflow",
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
								Business impact
							</p>
							<p className="mt-1 text-sm font-extrabold text-slate-900">
								লাভের হিসাব
							</p>
						</div>
					</div>
					<span className="rounded-full bg-secondary/10 px-2.5 py-1 text-[10px] font-bold text-secondary">
						UI preview
					</span>
				</div>
				<div className="mt-5 grid grid-cols-2 gap-3">
					<div className="rounded-xl bg-slate-50 p-4">
						<p className="text-[10px] font-semibold text-slate-400">
							চেক না করলে
						</p>
						<p className="mt-2 text-2xl font-extrabold text-rose-500">-৳ ৩৫০</p>
						<p className="mt-1 text-[10px] text-slate-500">সম্ভাব্য রিটার্ন খরচ</p>
					</div>
					<div className="rounded-xl bg-secondary/10 p-4">
						<p className="text-[10px] font-semibold text-secondary/60">
							চেক করলে
						</p>
						<p className="mt-2 text-2xl font-extrabold text-secondary">
							+৳ ৩৫০
						</p>
						<p className="mt-1 text-[10px] text-secondary/60">লাভ রক্ষার সুযোগ</p>
					</div>
				</div>
				<div className="mt-5 rounded-xl border border-slate-100 p-4">
					<div className="flex items-center justify-between">
						<p className="text-xs font-extrabold text-slate-800">
							মাসিক রিটার্ন কমানোর সম্ভাবনা
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
					সিদ্ধান্ত আপনার margin রক্ষা করে
				</div>
			</div>
		</div>
	);
}

export default function FeatureShowcase() {
	return (
		<section id="features" className="section-pad bg-secondary/5">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
						আপনার ব্যবসায় বাস্তব প্রভাব
					</p>
					<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
						ফিচার দেখানোর জন্য নয়,
						<br className="hidden sm:block" /> সিদ্ধান্ত বদলানোর জন্য তৈরি
					</h2>
					<p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
						একটি সুন্দর ড্যাশবোর্ডের পেছনে আছে আপনার সময়, পণ্য ও লাভ রক্ষার একটি নির্দিষ্ট
						workflow।
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
									<span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-secondary shadow-sm ring-1 ring-secondary/10">
										<Icon className="h-3.5 w-3.5" /> {feature.tag}
									</span>
									<h3 className="mt-5 text-3xl font-extrabold leading-tight text-slate-900">
										{feature.title}
									</h3>
									<p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600">
										{feature.desc}
									</p>
									<ul className="mt-7 space-y-3">
										{feature.points.map((point) => (
											<li
												key={point}
												className="flex items-center gap-2.5 text-sm font-semibold text-slate-700"
											>
												<CheckCircle2 className="h-5 w-5 text-secondary" />{" "}
												{point}
											</li>
										))}
									</ul>
								</div>
								<div className="relative">
									{index === 0 ? <MiniDashboard /> : <SavingsBoard />}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
