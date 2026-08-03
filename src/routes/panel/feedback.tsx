import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { PagePlaceholder } from "@/components/user/pagePlaceholder";

export const Route = createFileRoute("/panel/feedback")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<PagePlaceholder
			icon={MessageSquare}
			title="Feedback"
			titleBn="মতামত ও ফিডব্যাক"
			description="আপনার মতামত আমাদের কাছে গুরুত্বপূর্ণ। সমস্যা, সাজেশন বা ফিচার রিকোয়েস্ট জানান।"
			features={[
				"সাজেশন বা সমস্যা জানান",
				"অ্যাপ রেটিং দিন",
				"সাপোর্ট টিকেট খুলুন",
				"ফিচার রিকোয়েস্ট করুন",
			]}
		/>
	);
}
