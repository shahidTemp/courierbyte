import { Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
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

export default function AdminTable({
	data,
	onDeleteItem,
	onEditItem,
	searchTerm = "",
}: AdminTableProps) {
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState("");

	const handleConfirmDelete = async () => {
		if (!deleteConfirm || isDeleting) return;

		setIsDeleting(true);
		setDeleteError("");
		try {
			await onDeleteItem(deleteConfirm);
			setDeleteConfirm(null);
		} catch {
			setDeleteError("Failed to delete administrator. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	if (!data.length) {
		return (
			<div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-secondary/20 bg-white px-6 text-center">
				<ShieldCheck className="mb-4 size-12 text-secondary/35" />
				<h2 className="text-xl font-extrabold text-secondary-dark">
					No administrators found
				</h2>
				<p className="mt-1 text-sm text-slate-500">
					{searchTerm
						? "Try a different search term."
						: "Create your first administrator to get started."}
				</p>
			</div>
		);
	}

	return (
		<div className="m-0 overflow-x-auto rounded-2xl bg-white shadow-sm md:border md:border-slate-200">
			<table className="w-full border-collapse">
				<thead className="hidden md:table-header-group">
					<tr className="bg-secondary text-left text-sm text-white">
						{[
							"Sl.",
							"Administrator",
							"Number",
							"Status",
							"Created",
							"Action",
						].map((heading) => (
							<th className="px-5 py-4 font-bold" key={heading}>
								{heading}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="block md:table-row-group">
					{data.map((admin, index) => (
						<tr
							className="mb-4 block overflow-hidden rounded-lg border-2 border-slate-200 bg-white transition hover:bg-emerald-50/40 md:mb-0 md:table-row md:border-0 md:border-b"
							key={admin._id}
						>
							<td className="flex items-center justify-between border-b border-slate-200 p-2 text-right text-sm text-slate-500 md:table-cell md:border-0 md:p-5 md:text-left">
								<span className="mr-4 font-semibold text-slate-700 md:hidden">
									Sl.
								</span>
								{index + 1}
							</td>
							<td className="flex items-center justify-between border-b border-slate-200 p-2 text-right md:table-cell md:border-0 md:p-5 md:text-left">
								<span className="mr-4 font-semibold text-slate-700 md:hidden">
									Administrator
								</span>
								<div className="flex items-center gap-3">
									<span className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-sm font-extrabold text-secondary">
										{String(admin.name ?? "A")
											.charAt(0)
											.toUpperCase()}
									</span>
									<span className="font-bold text-secondary-dark">
										{admin.name}
									</span>
								</div>
							</td>
							<td className="flex items-center justify-between border-b border-slate-200 p-2 text-right text-sm text-slate-600 md:table-cell md:border-0 md:p-5 md:text-left">
								<span className="mr-4 font-semibold text-slate-700 md:hidden">
									Number
								</span>
								{admin.number}
							</td>
							<td className="flex items-center justify-between border-b border-slate-200 p-2 text-right md:table-cell md:border-0 md:p-5 md:text-left">
								<span className="mr-4 font-semibold text-slate-700 md:hidden">
									Status
								</span>
								<span
									className={`rounded-full px-3 py-1 text-xs font-bold ${admin.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}
								>
									{admin.isActive ? "Active" : "Inactive"}
								</span>
							</td>
							<td className="flex items-center justify-between border-b border-slate-200 p-2 text-right text-sm text-slate-500 md:table-cell md:border-0 md:p-5 md:text-left">
								<span className="mr-4 font-semibold text-slate-700 md:hidden">
									Created
								</span>
								{formateDate(admin.createdAt)}
							</td>
							<td className="flex items-center justify-between border-b border-slate-200 p-2 text-right md:table-cell md:border-0 md:p-5 md:text-left">
								<span className="mr-4 font-semibold text-slate-700 md:hidden">
									Actions
								</span>
								<div className="flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap md:justify-start">
									<button
										type="button"
										onClick={() => onEditItem(admin._id)}
										aria-label={`Edit ${admin.name}`}
										className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
									>
										<Pencil aria-hidden="true" className="size-3.5" />
										<span className="hidden sm:inline">Edit</span>
									</button>
									<button
										type="button"
										onClick={() => {
											setDeleteError("");
											setDeleteConfirm(admin._id);
										}}
										aria-label={`Delete ${admin.name}`}
										className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
									>
										<Trash2 aria-hidden="true" className="size-3.5" />
										<span className="hidden sm:inline">Delete</span>
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{deleteError && (
				<p
					className="px-5 py-3 text-sm font-semibold text-rose-600"
					role="alert"
				>
					{deleteError}
				</p>
			)}

			{deleteConfirm && (
				<DeleteModal
					itemName="administrator"
					onCancel={() => setDeleteConfirm(null)}
					onConfirm={handleConfirmDelete}
					isConfirming={isDeleting}
				/>
			)}
		</div>
	);
}
