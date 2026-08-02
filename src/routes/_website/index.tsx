import { createFileRoute } from "@tanstack/react-router";
import BusinessOutcome from "@/components/home/businessOutcome";
import Faq from "@/components/home/faq";
import FeatureShowcase from "@/components/home/featureShowcase";
import FinalCta from "@/components/home/finalCta";
import FreemiumSection from "@/components/home/freemiumSection";
import Hero from "@/components/home/hero";
import HowItWorks from "@/components/home/howItWorks";
import Pricing from "@/components/home/pricing";

export const Route = createFileRoute("/_website/")({ component: Home });

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
