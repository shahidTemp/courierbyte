// @ts-nocheck
import { Receipt } from "lucide-react";
import { useState } from "react";
import { formateDate } from "@/utils/formateDate";

const statusConfig = {
	active: {
		label: "Active",
		classes:
			"bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
	},
	pending: {
		label: "Pending",
		classes: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
	},
	expired: {
		label: "Expired",
		classes: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
	},
	cancelled: {
		label: "Cancelled",
		classes:
			"bg-slate-100 text-slate-700 dark:bg-gray-700/50 dark:text-gray-300",
	},
};

const planTypeLabel = { monthly: "Monthly", yearly: "Yearly" };

const mobileFieldClass =
	"flex items-center justify-between border-b border-slate-200 p-3 text-right text-sm last:border-b-0 dark:border-gray-700";

const MobileField = ({ label, children }) => (
	<div className={mobileFieldClass}>
		<span className="mr-4 font-semibold text-gray-700 dark:text-gray-300">
			{label}
		</span>
		<div className="text-gray-900 dark:text-gray-100">{children}</div>
	</div>
);

const StatusBadge = ({ status }) => {
	const config = statusConfig[status] ?? statusConfig.cancelled;
	return (
		<span
			className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config.classes}`}
		>
			{config.label}
		</span>
	);
};

const StatusSelect = ({ subscription, onStatusChange, isUpdating }) => (
	<select
		value={subscription.status}
		disabled={isUpdating}
		onChange={(event) => onStatusChange(subscription._id, event.target.value)}
		aria-label="Change subscription status"
		className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-secondary-dark outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
	>
		{Object.entries(statusConfig).map(([value, config]) => (
			<option key={value} value={value}>
				{config.label}
			</option>
		))}
	</select>
);

export const SubscriptionTable = ({ data, onStatusChange }) => {
	const [updatingId, setUpdatingId] = useState(null);

	const handleStatusChange = async (id, status) => {
		if (updatingId) return;
		setUpdatingId(id);
		try {
			await onStatusChange(id, status);
		} finally {
			setUpdatingId(null);
		}
	};

	if (!data.length) {
		return (
			<div className="flex min-h-[240px] flex-col items-center justify-center">
				<Receipt className="mb-4 text-5xl text-gray-400" />
				<h2 className="mb-2 text-xl font-semibold">No subscriptions found</h2>
			</div>
		);
	}

	return (
		<div id="subscription-table" className="m-0">
			{/* Mobile cards */}
			<div className="space-y-4 md:hidden">
				{data.map((item, index) => (
					<article
						className="overflow-hidden rounded-lg border-2 border-slate-200 bg-white shadow-sm transition hover:border-secondary/40 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
						key={item._id}
					>
						<div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
							<span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-gray-400">
								Subscription #{index + 1}
							</span>
							<StatusBadge status={item.status} />
						</div>
						<div>
							<MobileField label="User">
								<div className="text-right">
									<p className="font-bold">{item.userId?.name ?? "—"}</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										{item.userId?.number ?? ""}
									</p>
								</div>
							</MobileField>
							<MobileField label="Package">
								{item.packageSnapshot?.name ?? "—"}
							</MobileField>
							<MobileField label="Plan">
								{planTypeLabel[item.planType] ?? item.planType}
							</MobileField>
							<MobileField label="Amount">
								৳ {Number(item.paid_amount).toLocaleString()}
							</MobileField>
							<MobileField label="TrxID">
								<span className="font-mono text-xs">
									{item.payment?.transactionId ?? "—"}
								</span>
							</MobileField>
							<MobileField label="Created At">
								{formateDate(item.createdAt)}
							</MobileField>
							<MobileField label="Actions">
								<StatusSelect
									subscription={item}
									onStatusChange={handleStatusChange}
									isUpdating={updatingId === item._id}
								/>
							</MobileField>
						</div>
					</article>
				))}
			</div>

			{/* Desktop table */}
			<div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block md:border md:border-slate-200 dark:bg-gray-900 md:dark:border-gray-800">
				<table className="w-full border-collapse">
					<thead>
						<tr className="bg-secondary text-left text-sm text-white">
							{[
								"Sl.",
								"User",
								"Package",
								"Plan",
								"Amount",
								"Status",
								"TrxID",
								"Created At",
								"Actions",
							].map((heading, index) => (
								<th
									className={`p-4 font-bold ${index === 0 ? "rounded-tl-2xl" : ""} ${index === 8 ? "rounded-tr-2xl" : ""}`}
									key={heading}
								>
									{heading}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => (
							<tr
								className="text-secondary-dark transition even:bg-slate-50 hover:bg-emerald-50/40 dark:text-white dark:even:bg-gray-800 dark:hover:bg-gray-800/80"
								key={item._id}
							>
								<td className="border-b border-slate-200 p-4 dark:border-gray-700">
									{index + 1}
								</td>
								<td className="border-b border-slate-200 p-4 dark:border-gray-700">
									<p className="font-bold">{item.userId?.name ?? "—"}</p>
									<p className="text-xs text-slate-500 dark:text-gray-400">
										{item.userId?.number ?? ""}
									</p>
								</td>
								<td className="border-b border-slate-200 p-4 font-bold dark:border-gray-700">
									{item.packageSnapshot?.name ?? "—"}
								</td>
								<td className="border-b border-slate-200 p-4 dark:border-gray-700">
									<span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-bold text-slate-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
										{planTypeLabel[item.planType] ?? item.planType}
									</span>
								</td>
								<td className="border-b border-slate-200 p-4 font-bold dark:border-gray-700">
									৳ {Number(item.paid_amount).toLocaleString()}
								</td>
								<td className="border-b border-slate-200 p-4 dark:border-gray-700">
									<StatusBadge status={item.status} />
								</td>
								<td className="border-b border-slate-200 p-4 font-mono text-xs text-slate-500 dark:border-gray-700 dark:text-gray-400">
									{item.payment?.transactionId ?? "—"}
								</td>
								<td className="border-b border-slate-200 p-4 text-slate-500 dark:border-gray-700 dark:text-gray-400">
									{formateDate(item.createdAt)}
								</td>
								<td className="border-b border-slate-200 p-4 dark:border-gray-700">
									<StatusSelect
										subscription={item}
										onStatusChange={handleStatusChange}
										isUpdating={updatingId === item._id}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
