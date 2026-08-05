import { Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import DeleteModal from "@/components/common/deleteModal";
import { formateDate } from "@/utils/formateDate";

type AdminRow = {
	_id: string;
	name: string;
	number: string;
	isActive: boolean;
	createdAt: string;
};

type AdminTableProps = {
	data: AdminRow[];
	onDeleteItem: (id: string) => Promise<void>;
	onEditItem: (id: string) => void;
	searchTerm?: string;
};

const StatusBadge = ({ isActive }: { isActive: boolean }) =>
	isActive ? (
		<span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
			Active
		</span>
	) : (
		<span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
			Inactive
		</span>
	);

const ActionButtons = ({
	admin,
	onEditItem,
	onDelete,
}: {
	admin: AdminRow;
	onEditItem: (id: string) => void;
	onDelete: (id: string) => void;
}) => (
	<div className="flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap md:justify-start">
		<button
			type="button"
			onClick={() => onEditItem(admin._id)}
			aria-label={`Edit ${admin.name}`}
			className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
		>
			<Pencil aria-hidden="true" className="size-3.5" />
			<span className="hidden sm:inline">Edit</span>
		</button>
		<button
			type="button"
			onClick={() => onDelete(admin._id)}
			aria-label={`Delete ${admin.name}`}
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

export default function AdminTable({
	data,
	onDeleteItem,
	onEditItem,
	searchTerm = "",
}: AdminTableProps) {
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
			setDeleteError("Failed to delete admin. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	if (!data.length) {
		return (
			<div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-secondary/20 bg-white px-6 text-center">
				<ShieldCheck className="mb-4 size-12 text-secondary/35" />
				<h2 className="text-xl font-extrabold text-secondary-dark">
					No admins found
				</h2>
				<p className="mt-1 text-sm text-slate-500">
					{searchTerm
						? "Try a different search term."
						: "Create your first admin to get started."}
				</p>
			</div>
		);
	}

	return (
		<div className="m-0">
			{/* Mobile cards are separate from the table so rounded corners are reliable. */}
			<div className="space-y-4 md:hidden">
				{data.map((admin, index) => (
					<article
						className="overflow-hidden rounded-lg border-2 border-slate-200 bg-white shadow-sm transition hover:border-secondary/40 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
						key={admin._id}
					>
						<div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
							<span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-gray-400">
								Admin #{index + 1}
							</span>
							<StatusBadge isActive={admin.isActive} />
						</div>
						<MobileField label="admin">
							<span className="font-bold">{admin.name}</span>
						</MobileField>
						<MobileField label="Number">{admin.number}</MobileField>
						<MobileField label="Created">
							{formateDate(admin.createdAt)}
						</MobileField>
						<MobileField label="Actions">
							<ActionButtons
								admin={admin}
								onEditItem={onEditItem}
								onDelete={requestDelete}
							/>
						</MobileField>
					</article>
				))}
			</div>

			{/* Desktop table remains a standard table without block-level row overrides. */}
			<div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block md:border md:border-slate-200 dark:bg-gray-900 md:dark:border-gray-800">
				<table className="w-full border-collapse">
					<thead>
						<tr className="bg-secondary text-left text-sm text-white">
							{["Sl.", "admin", "Number", "Status", "Created", "Action"].map(
								(heading, index) => (
									<th
										className={`p-5 font-bold ${index === 0 ? "rounded-tl-2xl" : ""} ${index === 5 ? "rounded-tr-2xl" : ""}`}
										key={heading}
									>
										{heading}
									</th>
								),
							)}
						</tr>
					</thead>
					<tbody>
						{data.map((admin, index) => (
							<tr
								className="text-secondary-dark transition even:bg-slate-50 hover:bg-emerald-50/40 dark:text-white dark:even:bg-gray-800 dark:hover:bg-gray-800/80"
								key={admin._id}
							>
								<td className="border-b border-slate-200 p-5 text-sm text-slate-500 dark:border-gray-700">
									{index + 1}
								</td>
								<td className="border-b border-slate-200 p-5 dark:border-gray-700">
									<span className="font-bold text-secondary-dark dark:text-white">
										{admin.name}
									</span>
								</td>
								<td className="border-b border-slate-200 p-5 text-sm text-slate-600 dark:border-gray-700 dark:text-slate-300">
									{admin.number}
								</td>
								<td className="border-b border-slate-200 p-5 dark:border-gray-700">
									<StatusBadge isActive={admin.isActive} />
								</td>
								<td className="border-b border-slate-200 p-5 text-sm text-slate-500 dark:border-gray-700 dark:text-gray-400">
									{formateDate(admin.createdAt)}
								</td>
								<td className="border-b border-slate-200 p-5 dark:border-gray-700">
									<ActionButtons
										admin={admin}
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
					itemName="Admin"
					onCancel={() => setDeleteConfirm(null)}
					onConfirm={handleConfirmDelete}
					isConfirming={isDeleting}
				/>
			)}
		</div>
	);
}
