// @ts-nocheck
import { BarChart3, Search, ShieldCheck } from "lucide-react";

const steps = [
	{
		number: "০১",
		icon: Search,
		title: "অর্ডার আসলেই নাম্বার দিন",
		desc: "কাস্টমারের মোবাইল নাম্বারটি লিখুন। কোনো রেজিস্ট্রেশন ছাড়াই প্রথম ৫টি সার্চ ফ্রি।",
	},
	{
		number: "০২",
		icon: BarChart3,
		title: "রিপোর্টে ঝুঁকি বুঝুন",
		desc: "ডেলিভারি, ক্যানসেল, কুরিয়ারভিত্তিক ইতিহাস ও সাকসেস রেশিও এক স্ক্রিনে দেখুন।",
	},
	{
		number: "০৩",
		icon: ShieldCheck,
		title: "লাভের সিদ্ধান্ত নিন",
		desc: "COD পাঠাবেন, কনফার্মেশন কল করবেন নাকি অগ্রিম নেবেন — ডেটা দেখে ঠিক করুন।",
	},
];

export default function HowItWorks() {
	return (
		<section id="how" className="section-pad">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl">
					<p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
						সহজ workflow
					</p>
					<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
						অর্ডার থেকে সিদ্ধান্ত — এক মিনিটেরও কম সময়ে
					</h2>
					<p className="mt-4 text-lg leading-relaxed text-slate-600">
						আপনার টিমকে অনুমান করে নয়, তথ্য দেখে সিদ্ধান্ত নেওয়ার অভ্যাস দিন।
					</p>
				</div>
				<div className="relative mt-12 grid gap-5 md:grid-cols-3">
					<div
						aria-hidden
						className="absolute left-[16%] right-[16%] top-9 hidden border-t border-dashed border-secondary/20 md:block"
					/>
					{steps.map((step) => {
						const Icon = step.icon;
						return (
							<div
								key={step.number}
								className="relative rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
							>
								<div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
									<Icon className="h-7 w-7" />
									<span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-extrabold text-white ring-4 ring-white">
										{step.number}
									</span>
								</div>
								<h3 className="mt-6 text-lg font-extrabold text-slate-900">
									{step.title}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-slate-500">
									{step.desc}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
