// @ts-nocheck
import { BarChart3, Search, ShieldCheck } from "lucide-react";

const steps = [
	{
		number: "০১",
		icon: Search,
		title: "অর্ডার এলেই নম্বর দিন",
		desc: "অর্ডার পাওয়ার পর গ্রাহকের মোবাইল নম্বর লিখুন। নিবন্ধন ছাড়াই প্রথম ৫টি যাচাই বিনামূল্যে করতে পারবেন।",
	},
	{
		number: "০২",
		icon: BarChart3,
		title: "এক নজরে ঝুঁকি বুঝুন",
		desc: "ডেলিভারি, বাতিল ও ফেরতের ইতিহাস এবং সফল ডেলিভারির হার এক নজরে দেখুন।",
	},
	{
		number: "০৩",
		icon: ShieldCheck,
		title: "তথ্য দেখে সিদ্ধান্ত নিন",
		desc: "COD পাঠাবেন, ফোন করে অর্ডার নিশ্চিত করবেন, নাকি অগ্রিম নেবেন—সিদ্ধান্ত নিন তথ্যের ভিত্তিতে।",
	},
];

export default function HowItWorks() {
	return (
		<section id="how" className="section-pad">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl">
					<p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
						সহজ প্রক্রিয়া
					</p>
					<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
						অর্ডার থেকে সিদ্ধান্ত — এক মিনিটেরও কম সময়ে
					</h2>
					<p className="mt-4 text-lg leading-relaxed text-slate-600">
						আপনার টিমকে অনুমানের বদলে তথ্যের ভিত্তিতে সিদ্ধান্ত নিতে সাহায্য করুন।
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
