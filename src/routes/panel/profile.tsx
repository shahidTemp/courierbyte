// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { PagePlaceholder } from "@/components/user/pagePlaceholder";

export const Route = createFileRoute("/panel/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<PagePlaceholder
			icon={UserRound}
			title="Profile"
			titleBn="প্রোফাইল"
			description="আপনার ব্যক্তিগত তথ্য, মোবাইল নাম্বার ও নিরাপত্তা সেটিংস ম্যানেজ করুন।"
			features={[
				"ব্যক্তিগত তথ্য আপডেট",
				"মোবাইল নাম্বার যাচাই",
				"পাসওয়ার্ড ও নিরাপত্তা",
				"নোটিফিকেশন পছন্দ",
			]}
		/>
	);
}
