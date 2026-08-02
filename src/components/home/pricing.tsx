import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Crown } from "lucide-react";

const plans = [
	{
		name: "ফ্রি",
		kicker: "শুরু করে দেখুন",
		price: "৳০",
		period: "চিরতরে",
		description: "ব্যক্তিগতভাবে যাচাই করার জন্য",
		features: [
			"প্রতিদিন ৫টি সার্চ",
			"বেসিক কাস্টমার রিপোর্ট",
			"সাকসেস রেশিও",
			"ডেটা প্রাইভেসি",
		],
		cta: "ফ্রিতে শুরু করুন",
		popular: false,
	},
	{
		name: "গ্রো",
		kicker: "বেশি অর্ডার, বেশি নিয়ন্ত্রণ",
		price: "৳২৯৯",
		period: "/মাস",
		description: "নিয়মিত অর্ডার নেওয়া ব্যবসার জন্য",
		features: [
			"মাসে ৫০০টি সার্চ",
			"সম্পূর্ণ রিস্ক স্কোর",
			"কুরিয়ারভিত্তিক ব্রেকডাউন",
			"টিমের জন্য শেয়ারড অ্যাক্সেস",
			"প্রায়োরিটি সাপোর্ট",
		],
		cta: "গ্রো দিয়ে শুরু করুন",
		popular: true,
	},
	{
		name: "বিজনেস",
		kicker: "পুরো টিমের জন্য",
		price: "৳৯৯৯",
		period: "/মাস",
		description: "স্কেল করা ই-কমার্স অপারেশনের জন্য",
		features: [
			"আনলিমিটেড সার্চ",
			"API অ্যাক্সেস",
			"মাল্টি-ইউজার অ্যাকাউন্ট",
			"কাস্টম রিপোর্ট ও এক্সপোর্ট",
			"ডেডিকেটেড সাপোর্ট",
		],
		cta: "বিজনেস নিয়ে কথা বলুন",
		popular: false,
	},
];

export default function Pricing() {
	return (
		<section id="pricing" className="section-pad bg-secondary/5">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
						আপনার গতির সাথে বাড়ুন
					</p>
					<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
						একটি ভুল অর্ডারের চেয়ে
						<br />
						একটি প্যাকেজের দাম কম
					</h2>{" "}
					<p className="mt-4 text-lg text-slate-600">
						আগে ৫টি সার্চ ফ্রি। যখন ব্যবসা বাড়বে, তখন আপনার প্রয়োজনের প্ল্যানে যান।
					</p>
					<p className="mt-3 text-xs font-semibold text-slate-500">
						নিচের মূল্য ও limitগুলো launch-এর আগের UI preview — আপনার final business
						pricing অনুযায়ী আপডেটযোগ্য।
					</p>
				</div>
				<div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3">
					{plans.map((plan) => (
						<div
							key={plan.name}
							className={`relative flex flex-col rounded-2xl border bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-2xl ${plan.popular ? "border-secondary shadow-xl shadow-secondary/10 ring-2 ring-secondary/20 lg:-translate-y-3" : "border-slate-200/80 shadow-sm"}`}
						>
							{plan.popular && (
								<span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-secondary px-4 py-1.5 text-[11px] font-extrabold text-white shadow-lg shadow-secondary/25">
									<Crown className="mr-1 inline h-3.5 w-3.5" /> সবচেয়ে জনপ্রিয়
								</span>
							)}
							<p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">
								{plan.kicker}
							</p>
							<h3 className="mt-3 text-xl font-extrabold text-slate-900">
								{plan.name}
							</h3>
							<div className="mt-4 flex items-baseline gap-1">
								<span className="text-4xl font-extrabold tracking-tight text-slate-900">
									{plan.price}
								</span>
								<span className="text-sm font-semibold text-slate-400">
									{plan.period}
								</span>
							</div>
							<p className="mt-2 text-sm text-slate-500">{plan.description}</p>
							<div className="my-6 h-px bg-slate-100" />
							<ul className="flex-1 space-y-3.5">
								{plan.features.map((feature) => (
									<li
										key={feature}
										className="flex items-start gap-2.5 text-sm font-medium text-slate-600"
									>
										<Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />{" "}
										{feature}
									</li>
								))}
							</ul>
							<Link
								to="/login"
								className={`mt-8 flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-all ${plan.popular ? "bg-secondary text-white shadow-lg shadow-secondary/25 hover:bg-secondary-dark" : "border-2 border-secondary text-secondary hover:bg-secondary/10"}`}
							>
								{plan.cta} <ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					))}
				</div>
				<p className="mt-8 text-center text-xs font-medium text-slate-500">
					সব প্যাকেজে নিরাপদ ডেটা · কোনো hidden charge নেই · প্রয়োজনে যেকোনো সময়
					আপগ্রেড করুন
				</p>
			</div>
		</section>
	);
}
