import { KeyRound, Pencil, Trash2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import DeleteModal from "@/components/common/deleteModal";
import { formateDate } from "@/utils/formateDate";

type KeyRow = {
	_id: string;
	keyValue: string;
	dailyLimit: number;
	count: number;
	status: "active" | "inactive";
	createdAt: string;
};

type KeysTableProps = {
	data: KeyRow[];
	onEditItem: (id: string) => void;
	onDeleteItem: (id: string) => Promise<void>;
	searchTerm?: string;
};

const statusConfig = {
	active: {
		label: "Active",
		classes:
			"bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
	},
	inactive: {
		label: "Inactive",
		classes:
			"bg-slate-100 text-slate-700 dark:bg-gray-700/50 dark:text-gray-300",
	},
} as const;

type StatusValue = keyof typeof statusConfig;

const StatusBadge = ({ status }: { status: StatusValue }) => {
	const config = statusConfig[status] ?? statusConfig.inactive;
	return (
		<span
			className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${config.classes}`}
		>
			{config.label}
		</span>
	);
};

const ActionButtons = ({
	item,
	onEditItem,
	onDelete,
}: {
	item: KeyRow;
	onEditItem: (id: string) => void;
	onDelete: (id: string) => void;
}) => (
	<div className="flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
		<button
			type="button"
			onClick={() => onEditItem(item._id)}
			aria-label={`Edit key ${item.keyValue}`}
			className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
		>
			<Pencil aria-hidden="true" className="size-3.5" />
			<span className="hidden sm:inline">Edit</span>
		</button>
		<button
			type="button"
			onClick={() => onDelete(item._id)}
			aria-label={`Delete key ${item.keyValue}`}
			className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
		>
			<Trash2 aria-hidden="true" className="size-3.5" />
			<span className="hidden sm:inline">Delete</span>
		</button>
	</div>
);

const MobileField = ({
	label,
	children,
}: {
	label: string;
	children: ReactNode;
}) => (
	<div className="flex items-center justify-between border-b border-slate-200 p-3 text-right text-sm last:border-b-0 dark:border-gray-700">
		<span className="mr-4 font-semibold text-slate-700 dark:text-gray-300">
			{label}
		</span>
		<div className="text-slate-900 dark:text-gray-100">{children}</div>
	</div>
);

export const KeysTable = ({
	data,
	onEditItem,
	onDeleteItem,
	searchTerm = "",
}: KeysTableProps) => {
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState("");

	const requestDelete = (id: string) => {
		setDeleteError("");
		setDeleteConfirm(id);
	};

	const handleConfirmDelete = async () => {
		if (!deleteConfirm || isDeleting) return;

		setIsDeleting(true);
		setDeleteError("");
		try {
			await onDeleteItem(deleteConfirm);
			setDeleteConfirm(null);
		} catch {
			setDeleteError("Failed to delete key. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	if (!data.length) {
		return (
			<div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-secondary/20 bg-white px-6 text-center dark:bg-gray-900">
				<KeyRound className="mb-4 size-12 text-secondary/35" />
				<h2 className="text-xl font-extrabold text-secondary-dark dark:text-white">
					No keys found
				</h2>
				<p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
					{searchTerm
						? "Try a different search term."
						: "Add a courier API key to get started."}
				</p>
			</div>
		);
	}

	return (
		<div className="m-0">
			{/* Mobile cards */}
			<div className="space-y-4 md:hidden">
				{data.map((item, index) => (
					<article
						className="overflow-hidden rounded-lg border-2 border-slate-200 bg-white shadow-sm transition hover:border-secondary/40 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
						key={item._id}
					>
						<div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
							<span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-gray-400">
								Key #{index + 1}
							</span>
							<StatusBadge status={item.status} />
						</div>
						<div>
							<MobileField label="Key">
								<span className="font-mono text-xs font-bold">
									{item.keyValue}
								</span>
							</MobileField>
							<MobileField label="Daily limit">
								{item.dailyLimit.toLocaleString()}
							</MobileField>
							<MobileField label="Used today">
								{item.count.toLocaleString()}
							</MobileField>
							<MobileField label="Created At">
								{formateDate(item.createdAt)}
							</MobileField>
							<MobileField label="Actions">
								<ActionButtons
									item={item}
									onEditItem={onEditItem}
									onDelete={requestDelete}
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
								"Key",
								"Daily limit",
								"Used today",
								"Status",
								"Created At",
								"Actions",
							].map((heading, index) => (
								<th
									className={`p-4 font-bold ${index === 0 ? "rounded-tl-2xl" : ""} ${index === 6 ? "rounded-tr-2xl" : ""}`}
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
								<td className="border-b border-slate-200 p-4 font-mono text-sm font-bold dark:border-gray-700">
									{item.keyValue}
								</td>
								<td className="border-b border-slate-200 p-4 font-bold dark:border-gray-700">
									{item.dailyLimit.toLocaleString()}
								</td>
								<td className="border-b border-slate-200 p-4 text-slate-500 dark:border-gray-700 dark:text-gray-400">
									{item.count.toLocaleString()}
								</td>
								<td className="border-b border-slate-200 p-4 dark:border-gray-700">
									<StatusBadge status={item.status} />
								</td>
								<td className="border-b border-slate-200 p-4 text-slate-500 dark:border-gray-700 dark:text-gray-400">
									{formateDate(item.createdAt)}
								</td>
								<td className="border-b border-slate-200 p-4 dark:border-gray-700">
									<ActionButtons
										item={item}
										onEditItem={onEditItem}
										onDelete={requestDelete}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{deleteError && (
				<p
					className="mt-3 px-5 py-3 text-sm font-semibold text-rose-600"
					role="alert"
				>
					{deleteError}
				</p>
			)}

			{deleteConfirm && (
				<DeleteModal
					itemName="key"
					onCancel={() => setDeleteConfirm(null)}
					onConfirm={handleConfirmDelete}
					isConfirming={isDeleting}
				/>
			)}
		</div>
	);
};
