import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
	{
		q: "প্রতিদিন ৫টি ফ্রি সার্চ কীভাবে কাজ করবে?",
		a: "প্রতিদিন প্রতিটি visitor পাঁচটি কাস্টমার নাম্বার কোনো খরচ ছাড়াই চেক করতে পারবেন। ফাংশনালিটি যুক্ত হলে অ্যাকাউন্ট ও usage tracking-এর মাধ্যমে এই সীমা নিয়ন্ত্রণ করা হবে।",
	},
	{
		q: "৫টি সার্চ শেষ হলে কী হবে?",
		a: "আপনি সেদিনের free limit শেষ করলে লগইন করে একটি প্যাকেজ বেছে নিতে পারবেন। প্যাকেজ নিলে আরও বেশি সার্চ, পূর্ণাঙ্গ রিপোর্ট ও team-oriented সুবিধা পাওয়া যাবে।",
	},
	{
		q: "ফ্রি প্ল্যানে কি কার্ড লাগবে?",
		a: "না। ফ্রি ব্যবহার শুরু করতে কোনো কার্ড বা পেমেন্ট লাগবে না। আগে ব্যবহার করে আপনার ব্যবসায়ের জন্য উপকারিতা বুঝে নিন।",
	},
	{
		q: "রিপোর্টে কী কী দেখা যাবে?",
		a: "মোট পার্সেল, সফল ডেলিভারি, ক্যানসেল/রিটার্ন, কুরিয়ারভিত্তিক ইতিহাস, সাকসেস রেশিও ও একটি সহজ risk/action hint দেখা যাবে।",
	},
];

export default function Faq() {
	const [open, setOpen] = useState(0);
	return (
		<section id="faq" className="section-pad">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
							প্রশ্ন থাকতেই পারে
						</p>
						<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
							শুরু করার আগে
							<br />
							সবকিছু জেনে নিন
						</h2>
						<p className="mt-4 text-base leading-relaxed text-slate-600">
							ফ্রি দিয়ে শুরু করা, usage limit আর রিপোর্ট নিয়ে সাধারণ প্রশ্নগুলোর উত্তর
							এখানে।
						</p>
					</div>
					<div className="space-y-3">
						{faqs.map((faq, index) => {
							const isOpen = open === index;
							return (
								<div
									key={faq.q}
									className={`overflow-hidden rounded-2xl border bg-white transition-all ${isOpen ? "border-emerald-200 shadow-md" : "border-slate-200/80 shadow-sm"}`}
								>
									{" "}
									<button
										type="button"
										onClick={() => setOpen(isOpen ? -1 : index)}
										aria-expanded={isOpen}
										aria-controls={`faq-panel-${index}`}
										className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
									>
										<span className="text-sm font-extrabold text-slate-800">
											{faq.q}
										</span>
										<span
											className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${isOpen ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-700"}`}
										>
											<ChevronDown
												className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
											/>
										</span>
									</button>{" "}
									<div
										id={`faq-panel-${index}`}
										className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
									>
										<div className="overflow-hidden">
											<p className="px-5 pb-5 text-sm leading-relaxed text-slate-500">
												{faq.a}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</section>
	);
}
