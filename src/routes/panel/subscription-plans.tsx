// @ts-nocheck
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Gem } from "lucide-react";
import { PackageGrid } from "@/components/plans/packageGrid";

export const Route = createFileRoute("/panel/subscription-plans")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();

	const handleSelect = (planId: string, cycle: "monthly" | "yearly") => {
		void navigate({
			to: "/subscription",
			search: { plan: planId, cycle },
		});
	};

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-6xl">
				<div className="mb-6 flex flex-wrap items-center gap-3">
					<span
						aria-hidden="true"
						className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary-dark text-white shadow-lg shadow-secondary/25"
					>
						<Gem className="h-5 w-5" />
					</span>
					<div className="min-w-0 flex-1">
						<h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
							Subscription Plans
						</h1>
						<p className="mt-1 text-sm font-semibold text-secondary/70">
							সাবস্ক্রিপশন প্ল্যান
						</p>
					</div>
				</div>
				<PackageGrid onSelect={handleSelect} />
			</div>
		</div>
	);
}
