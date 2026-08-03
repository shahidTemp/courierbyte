import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { PagePlaceholder } from "@/components/user/pagePlaceholder";

export const Route = createFileRoute("/panel/fraud-checker")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<PagePlaceholder
			icon={ShieldCheck}
			title="Fraud Checker"
			titleBn="জালিয়াতি যাচাই"
			description="কাস্টমারের মোবাইল নাম্বার দিয়ে কুরিয়ার হিস্ট্রি চেক করে COD ঝুঁকি এড়ান। রিস্ক স্কোর, সাকসেস রেশিও আর কুরিয়ারভিত্তিক ব্রেকডাউন এক স্ক্রিনে।"
			features={[
				"নাম্বার দিয়ে কুরিয়ার হিস্ট্রি সার্চ",
				"রিস্ক স্কোর ও সাকসেস রেশিও",
				"কুরিয়ারভিত্তিক ডেলিভারি ব্রেকডাউন",
				"সিদ্ধান্তের ইঙ্গিত ও সাশ্রয়ের হিসাব",
			]}
		/>
	);
}
