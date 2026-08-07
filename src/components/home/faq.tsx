// @ts-nocheck
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
	{
		q: "প্রতিদিন ৫টি বিনামূল্যের যাচাই কীভাবে কাজ করবে?",
		a: "প্রতিদিন প্রতিটি ব্যবহারকারী পাঁচটি গ্রাহকের নম্বর বিনা খরচে যাচাই করতে পারবেন। এই সীমাটি অ্যাকাউন্ট ও ব্যবহারের হিসাবের মাধ্যমে পরিচালিত হবে।",
	},
	{
		q: "৫টি যাচাই শেষ হলে কী হবে?",
		a: "সেদিনের বিনামূল্যের সীমা শেষ হলে লগইন করে একটি প্যাকেজ বেছে নিতে পারবেন। প্যাকেজ নিলে আরও বেশি যাচাই, বিস্তারিত রিপোর্ট ও দলগত ব্যবহারের সুবিধা পাবেন।",
	},
	{
		q: "বিনামূল্যের প্ল্যানে কি কার্ড লাগবে?",
		a: "না। বিনামূল্যে ব্যবহার শুরু করতে কোনো কার্ড বা পেমেন্ট তথ্য দিতে হবে না। আগে ব্যবহার করে আপনার ব্যবসার জন্য এটি কতটা উপকারী, বুঝে নিন।",
	},
	{
		q: "রিপোর্টে কী কী জানা যাবে?",
		a: "মোট পার্সেল, সফল ডেলিভারি, বাতিল ও ফেরতের হিসাব, কুরিয়ারভিত্তিক ইতিহাস, সফল ডেলিভারির হার এবং সহজ ঝুঁকি-পরামর্শ জানতে পারবেন।",
	},
];

export default function Faq() {
	const [open, setOpen] = useState(0);
	return (
		<section id="faq" className="section-pad">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
					<div>
						<p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
							প্রশ্ন থাকতেই পারে
						</p>
						<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
							শুরু করার আগে
							<br />
							সবকিছু জেনে নিন
						</h2>
						<p className="mt-4 text-base leading-relaxed text-slate-600">
							বিনামূল্যে শুরু করা, ব্যবহারের সীমা এবং রিপোর্ট—সব নিয়ে সাধারণ প্রশ্নের উত্তর
							এখানে।
						</p>
					</div>
					<div className="space-y-3">
						{faqs.map((faq, index) => {
							const isOpen = open === index;
							return (
								<div
									key={faq.q}
									className={`overflow-hidden rounded-2xl border bg-white transition-all ${isOpen ? "border-secondary/20 shadow-md" : "border-slate-200/80 shadow-sm"}`}
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
											className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all ${isOpen ? "bg-secondary text-white" : "bg-secondary/10 text-secondary"}`}
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
