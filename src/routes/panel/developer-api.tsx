import { createFileRoute } from "@tanstack/react-router";
import { Code2 } from "lucide-react";
import { PagePlaceholder } from "@/components/user/pagePlaceholder";

export const Route = createFileRoute("/panel/developer-api")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<PagePlaceholder
			icon={Code2}
			title="Developer API"
			titleBn="ডেভেলপার API"
			description="API কী তৈরি ও ম্যানেজ করুন, ডকুমেন্টেশন দেখুন এবং আপনার সিস্টেমে কুরিয়ারবাইট যুক্ত করুন।"
			features={[
				"API কী তৈরি ও ম্যানেজ",
				"API ডকুমেন্টেশন ও উদাহরণ",
				"রেট লিমিট ও ব্যবহারের পরিসংখ্যান",
				"ওয়েবহুক ইভেন্ট সাবস্ক্রিপশন",
			]}
		/>
	);
}
