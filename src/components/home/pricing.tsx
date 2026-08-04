// @ts-nocheck
import { queryOptions, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { getActivePackages } from "@/server/functions/package.fn";

export const packagesQuery = queryOptions({
	queryKey: ["active-packages"],
	queryFn: () => getActivePackages(),
});

const formatPrice = (price: number) =>
	`৳${Number(price).toLocaleString("bn-BD")}`;
const formatLimit = (limit: number, durationInDays: number) => {
	if (limit === 0) return "আনলিমিটেড API কল";
	const period =
		durationInDays === 30 ? "মাসে" : durationInDays === 365 ? "বছরে" : "এই সময়ে";
	return `${period} ${Number(limit).toLocaleString("bn-BD")}টি API কল`;
};

const formatPeriod = (durationInDays: number) => {
	if (durationInDays === 30) return "/মাস";
	if (durationInDays === 365) return "/বছর";
	return `${Number(durationInDays).toLocaleString("bn-BD")} দিন`;
};

export default function Pricing() {
	const { data: packages = [], isLoading, isError } = useQuery(packagesQuery);

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
						আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন।
					</p>
				</div>

				{isLoading ? (
					<div className="mt-12 flex min-h-64 items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-sm">
						<output className="flex items-center gap-3 text-sm font-bold text-secondary">
							<LoaderCircle className="h-5 w-5 animate-spin" /> প্যাকেজ লোড
							হচ্ছে...
						</output>
					</div>
				) : isError ? (
					<div className="mt-12 rounded-2xl border border-rose-200 bg-rose-50 px-6 py-10 text-center">
						<p className="text-base font-bold text-rose-700">
							প্যাকেজগুলো এখন লোড করা যাচ্ছে না।
						</p>
						<p className="mt-2 text-sm text-rose-600">
							কিছুক্ষণ পর আবার চেষ্টা করুন।
						</p>
					</div>
				) : packages.length === 0 ? (
					<div className="mt-12 rounded-2xl border border-slate-200/80 bg-white px-6 py-10 text-center shadow-sm">
						<p className="text-base font-bold text-slate-700">
							এই মুহূর্তে কোনো প্যাকেজ পাওয়া যায়নি।
						</p>
						<p className="mt-2 text-sm text-slate-500">
							শীঘ্রই নতুন প্যাকেজ যোগ করা হবে।
						</p>
					</div>
				) : (
					<div className="mx-auto mt-12 grid max-w-6xl gap-5 lg:grid-cols-3">
						{packages.map((plan) => {
							const period = formatPeriod(plan.duration_in_days);
							const features = [
								formatLimit(plan.api_call_limit, plan.duration_in_days),
								...plan.features,
							];

							return (
								<div
									key={plan._id}
									className="relative flex flex-col rounded-2xl border border-slate-200/80 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-2xl"
								>
									<p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">
										আপনার জন্য সঠিক প্যাকেজ
									</p>
									<h3 className="mt-3 text-xl font-extrabold text-slate-900">
										{plan.name}
									</h3>
									<div className="mt-4 flex items-baseline gap-1">
										<span className="text-4xl font-extrabold tracking-tight text-slate-900">
											{formatPrice(plan.price)}
										</span>
										<span className="text-sm font-semibold text-slate-400">
											{period}
										</span>
									</div>
									<p className="mt-2 text-sm text-slate-500">
										{plan.description}
									</p>
									<div className="my-6 h-px bg-slate-100" />
									<ul className="flex-1 space-y-3.5">
										{features.map((feature, featureIndex) => (
											<li
												// biome-ignore lint/suspicious/noArrayIndexKey: package features are position-controlled
												key={`${plan._id}-${featureIndex}`}
												className="flex items-start gap-2.5 text-sm font-medium text-slate-600"
											>
												<Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />{" "}
												{feature}
											</li>
										))}
									</ul>
									<Link
										to="/login"
										className="mt-8 flex items-center justify-center gap-2 rounded-xl border-2 border-secondary px-5 py-3.5 text-sm font-bold text-secondary transition-all hover:bg-secondary/10"
									>
										{plan.price === 0 ? "ফ্রিতে শুরু করুন" : "শুরু করুন"}{" "}
										<ArrowRight className="h-4 w-4" />
									</Link>
								</div>
							);
						})}
					</div>
				)}

				<p className="mt-8 text-center text-xs font-medium text-slate-500">
					সব প্যাকেজে নিরাপদ ডেটা · কোনো hidden charge নেই · প্রয়োজনে যেকোনো সময়
					আপগ্রেড করুন
				</p>
			</div>
		</section>
	);
}
