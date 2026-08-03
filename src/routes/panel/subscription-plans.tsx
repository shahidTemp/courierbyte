import { createFileRoute } from "@tanstack/react-router";
import { Gem } from "lucide-react";
import { PagePlaceholder } from "@/components/user/pagePlaceholder";

export const Route = createFileRoute("/panel/subscription-plans")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<PagePlaceholder
			icon={Gem}
			title="Subscription Plans"
			titleBn="সাবস্ক্রিপশন প্ল্যান"
			description="আপনার ব্যবসার প্রয়োজনে বেছে নিন সঠিক প্ল্যান — ফ্রি থেকে বিজনেস পর্যন্ত। প্ল্যান বদলান বা আপগ্রেড করুন যেকোনো সময়।"
			features={[
				"ফ্রি / গ্রো / বিজনেস প্ল্যান",
				"সার্চ লিমিট ও API অ্যাক্সেস",
				"যেকোনো সময় আপগ্রেড বা ডাউনগ্রেড",
				"টিম মেম্বার ও শেয়ার্ড অ্যাক্সেস",
			]}
		/>
	);
}
