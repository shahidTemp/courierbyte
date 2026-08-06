// @ts-nocheck
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/context/userContext";
import { PackageGrid } from "@/components/plans/packageGrid";

export default function Pricing() {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

	const handleSelect = (planId: string, cycle: "monthly" | "yearly") => {
		if (isAuthLoading) return;

		if (!isAuthenticated) {
			void navigate({ to: "/login" });
			return;
		}

		void navigate({
			to: "/subscription",
			search: { plan: planId, cycle },
		});
	};

	return (
		<section id="pricing" className="section-pad bg-secondary/5">
			<div className="maxw px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
						আপনার প্রয়োজন অনুযায়ী প্যাকেজ বেছে নিন
					</h2>
				</div>
				<PackageGrid onSelect={handleSelect} />
			</div>
		</section>
	);
}
