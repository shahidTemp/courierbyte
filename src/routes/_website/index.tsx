// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import BusinessOutcome from "@/components/home/businessOutcome";
import Faq from "@/components/home/faq";
import FeatureShowcase from "@/components/home/featureShowcase";
import FinalCta from "@/components/home/finalCta";
import FreemiumSection from "@/components/home/freemiumSection";
import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/howItWorks";
import Pricing from "@/components/home/pricing";
import { packagesQuery } from "@/components/plans/packageGrid";

export const Route = createFileRoute("/_website/")({
	loader: ({ context }) => context.queryClient.prefetchQuery(packagesQuery),
	component: Home,
});

function Home() {
	return (
		<div>
			<Hero />
			<BusinessOutcome />
			<HowItWorks />
			<FeatureShowcase />
			<FreemiumSection />
			<Pricing />
			<Faq />
			<FinalCta />
		</div>
	);
}
