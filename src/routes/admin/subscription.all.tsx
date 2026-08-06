// @ts-nocheck
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Search } from "lucide-react";
import { useState } from "react";
import { SubscriptionTable } from "@/components/admin/subscriptionTable";
import {
	getAllSubscriptions,
	updateSubscriptionStatus,
} from "@/server/functions/subscription.fn";

const subscriptionsQuery = queryOptions({
	queryKey: ["subscriptions"],
	queryFn: async () => getAllSubscriptions(),
});

export const Route = createFileRoute("/admin/subscription/all")({
	loader: ({ context }) => context.queryClient.ensureQueryData(subscriptionsQuery),
	component: SubscriptionsPage,
});

function SubscriptionsPage() {
	const queryClient = useQueryClient();
	const updateStatusFn = useServerFn(updateSubscriptionStatus);
	const { data: subscriptions = [] } = useQuery(subscriptionsQuery);
	const [searchTerm, setSearchTerm] = useState("");

	const query = searchTerm.trim().toLowerCase();
	const filteredSubscriptions = query
		? subscriptions.filter((item) =>
				[
					item.userId?.name,
					item.userId?.number,
					item.packageSnapshot?.name,
					item.payment?.transactionId,
					item.status,
				].some((value) =>
					String(value ?? "").toLowerCase().includes(query),
				),
			)
		: subscriptions;

	const handleStatusChange = async (id, status) => {
		const updated = await updateStatusFn({ data: { id, status } });
		queryClient.setQueryData(subscriptionsQuery.queryKey, (current = []) =>
			current.map((item) => (item._id === updated._id ? updated : item)),
		);
	};

	return (
		<main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<h1 className="mt-1 text-3xl font-extrabold tracking-tight text-secondary-dark">
						All subscriptions
					</h1>

					<div className="relative w-full sm:w-64">
						<Search
							aria-hidden="true"
							className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
						/>
						<input
							aria-label="Search subscriptions"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Search subscriptions..."
							className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
						/>
					</div>
				</div>

				<SubscriptionTable
					data={filteredSubscriptions}
					onStatusChange={handleStatusChange}
				/>
			</div>
		</main>
	);
}
