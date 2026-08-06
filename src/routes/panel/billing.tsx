// @ts-nocheck
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Loader as LoaderIcon } from "lucide-react";
import { Loader } from "@/components/common/loader";
import { useAuth } from "@/context/userContext";
import { getMySubscriptions } from "@/server/functions/subscription.fn";

const mySubscriptionsQuery = queryOptions({
	queryKey: ["my-subscriptions"],
	queryFn: () => getMySubscriptions(),
});

export const Route = createFileRoute("/panel/billing")({
	component: RouteComponent,
});

const statusConfig = {
	active: {
		classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
		dot: "bg-emerald-500",
	},
	pending: {
		classes: "bg-amber-50 text-amber-700 border-amber-200",
		dot: "bg-amber-500",
	},
	expired: {
		classes: "bg-red-50 text-red-700 border-red-200",
		dot: "bg-red-500",
	},
	cancelled: {
		classes: "bg-slate-100 text-slate-500 border-slate-200",
		dot: "bg-slate-400",
	},
};

const planTypeLabel = { monthly: "মাসিক", yearly: "বার্ষিক" };

const formatDate = (date) =>
	new Date(date).toLocaleDateString("bn-BD", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

const formatAmount = (n) => Number(n).toLocaleString("bn-BD");

function RouteComponent() {
	const { isAuthenticated, isLoading } = useAuth();
	const { data: subscriptions = [], isLoading: isSubsLoading } =
		useQuery(mySubscriptionsQuery);

	if (isLoading || isSubsLoading) return <Loader />;
	if (!isAuthenticated) return null;

	return (
		<div className="p-4 sm:p-6 lg:p-8">
			<div className="mx-auto max-w-4xl">
				{subscriptions.length === 0 ? (
					<div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-white py-16 text-center">
						<span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
							<LoaderIcon className="h-6 w-6" />
						</span>
						<p className="text-sm font-semibold text-slate-500">
							এখনো কোনো সাবস্ক্রিপশন নেই
						</p>
						<p className="text-xs text-slate-400">প্ল্যান বেছে নিয়ে পেমেন্ট করুন</p>
					</div>
				) : (
					<div className="space-y-4">
						{subscriptions.map((sub) => {
							const status = statusConfig[sub.status] ?? statusConfig.cancelled;
							return (
								<div
									key={sub._id}
									className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
								>
									<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
										<div className="flex items-center gap-3">
											<h3 className="text-base font-extrabold text-slate-900">
												{sub.packageSnapshot?.name ?? "প্যাকেজ"}
											</h3>
											<span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-bold text-slate-500">
												{planTypeLabel[sub.planType]}
											</span>
										</div>
										<span
											className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${status.classes}`}
										>
											<span className={`size-1.5 rounded-full ${status.dot}`} />
											{sub.status}
										</span>
									</div>

									<div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
										<div>
											<p className="text-xs font-semibold text-slate-400">
												পরিমাণ
											</p>
											<p className="font-bold text-slate-800">
												৳ {formatAmount(sub.paid_amount)}
											</p>
										</div>
										<div>
											<p className="text-xs font-semibold text-slate-400">
												সাবমিট তারিখ
											</p>
											<p className="font-semibold text-slate-700">
												{formatDate(sub.createdAt)}
											</p>
										</div>
										<div className="col-span-2 sm:col-span-1">
											<p className="text-xs font-semibold text-slate-400">
												মেয়াদ শেষ
											</p>
											<p className="font-semibold text-slate-700">
												{formatDate(sub.end_date)}
											</p>
										</div>
										<div className="col-span-2 sm:col-span-3">
											<p className="text-xs font-semibold text-slate-400">
												Transaction ID
											</p>
											<p className="font-mono text-xs font-semibold text-slate-600">
												{sub.payment?.transactionId ?? "—"}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
