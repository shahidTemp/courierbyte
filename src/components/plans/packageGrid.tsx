import { queryOptions, useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { getActivePackages } from "@/server/functions/package.fn";

export type Plan = {
	_id: string;
	name: string;
	description: string;
	price: number;
	yearly_price: number;
	features: string[];
};

export const packagesQuery = queryOptions({
	queryKey: ["active-packages"],
	queryFn: () => getActivePackages() as Promise<Plan[]>,
});

const formatPrice = (price: number) =>
	`৳${Number(price).toLocaleString("bn-BD")}`;

type PackageGridProps = {
	onSelect: (planId: string, cycle: "monthly" | "yearly") => void;
};

export function PackageGrid({ onSelect }: PackageGridProps) {
	const { data: packages = [], isLoading, isError } = useQuery(packagesQuery);
	const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
		"monthly",
	);

	return (
		<>
			<div className="mt-6 flex justify-center">
				<fieldset className="inline-flex rounded-xl border border-white/10 bg-night-soft p-1 shadow-sm">
					<legend className="sr-only">Choose billing cycle</legend>
					<button
						type="button"
						aria-pressed={billingCycle === "monthly"}
						onClick={() => setBillingCycle("monthly")}
						className={`rounded-lg px-5 py-2 text-sm font-bold transition-all ${billingCycle === "monthly" ? "bg-accent text-white shadow-sm" : "text-white/55 hover:bg-accent/10 hover:text-accent"}`}
					>
						মাসিক
					</button>
					<button
						type="button"
						aria-pressed={billingCycle === "yearly"}
						onClick={() => setBillingCycle("yearly")}
						className={`rounded-lg px-5 py-2 text-sm font-bold transition-all ${billingCycle === "yearly" ? "bg-accent text-white shadow-sm" : "text-white/55 hover:bg-accent/10 hover:text-accent"}`}
					>
						বাৎসরিক
					</button>
				</fieldset>
			</div>

			{isLoading ? (
				<div className="mt-12 flex min-h-64 items-center justify-center rounded-2xl border border-white/10 bg-night-soft shadow-sm">
					<output className="flex items-center gap-3 text-sm font-bold text-secondary">
						<LoaderCircle className="h-5 w-5 animate-spin" /> প্যাকেজ লোড
						হচ্ছে...
					</output>
				</div>
			) : isError ? (
				<div className="mt-12 rounded-2xl border border-rose-300/15 bg-rose-300/[0.07] px-6 py-10 text-center">
					<p className="text-base font-bold text-rose-700">
						প্যাকেজগুলো এখন লোড করা যাচ্ছে না।
					</p>
					<p className="mt-2 text-sm text-rose-600">
						কিছুক্ষণ পর আবার চেষ্টা করুন।
					</p>
				</div>
			) : packages.length === 0 ? (
				<div className="mt-12 rounded-2xl border border-white/10 bg-night-soft px-6 py-10 text-center shadow-sm">
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
						const selectedPrice =
							billingCycle === "monthly" ? plan.price : plan.yearly_price;

						return (
							<div
								key={plan._id}
								className="relative flex flex-col rounded-2xl border border-white/10 bg-night-soft p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-accent/40 hover:shadow-2xl"
							>
								<h3 className="text-xl font-extrabold text-white">
									{plan.name}
								</h3>
								<div className="mt-4">
									<span className="text-4xl font-extrabold tracking-tight text-white">
										{formatPrice(selectedPrice)}
									</span>
								</div>
								<p className="mt-2 text-sm text-slate-500">
									{plan.description}
								</p>
								<div className="my-6 h-px bg-white/10" />
								<ul className="flex-1 space-y-3.5">
									{plan.features.map((feature, featureIndex) => (
										<li
											// biome-ignore lint/suspicious/noArrayIndexKey: package features are position-controlled
											key={`${plan._id}-${featureIndex}`}
											className="flex items-start gap-2.5 text-sm font-medium text-white/70"
										>
											<Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{" "}
											{feature}
										</li>
									))}
								</ul>
								<button
									type="button"
									onClick={() => onSelect(plan._id, billingCycle)}
									className="mt-8 flex items-center justify-center gap-2 rounded-xl border-2 border-accent px-5 py-3.5 text-sm font-bold text-accent transition-all hover:bg-accent/10"
								>
									{selectedPrice === 0 ? "ফ্রিতে শুরু করুন" : "শুরু করুন"}{" "}
									<ArrowRight className="h-4 w-4" />
								</button>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
}
