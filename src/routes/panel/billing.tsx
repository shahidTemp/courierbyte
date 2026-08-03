import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "lucide-react";
import { PagePlaceholder } from "@/components/user/pagePlaceholder";

export const Route = createFileRoute("/panel/billing")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<PagePlaceholder
			icon={Receipt}
			title="Billing"
			titleBn="বিলিং ও পেমেন্ট"
			description="ইনভয়েস দেখুন, পেমেন্ট করুন আর রসিদ ডাউনলোড করুন। সব লেনদেনের হিসাব এক জায়গায়।"
			features={[
				"ইনভয়েস ও পেমেন্ট হিস্টরি",
				"ডিজিটাল রসিদ ডাউনলোড",
				"অটো-রিনিউয়াল নিয়ন্ত্রণ",
				"একাধিক পেমেন্ট মেথড",
			]}
		/>
	);
}
