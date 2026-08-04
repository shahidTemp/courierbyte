// @ts-nocheck
import { Pencil, Trash2, Users } from "lucide-react";
import { useState } from "react";
import DeleteModal from "@/components/common/deleteModal";
import { formateDate } from "@/utils/formateDate";

const getHighlightedText = (text, highlight) => {
	const safeText = text ? String(text) : "";
	const safeHighlight = highlight.trim();

	if (!safeHighlight || !safeText) return <span>{safeText}</span>;

	const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const regex = new RegExp(`(${escapeRegExp(safeHighlight)})`, "gi");
	let isHighlighted = false;
	let highlightCount = 0;

	return (
		<span>
			{safeText.split(regex).map((part) => {
				const shouldHighlight = isHighlighted;
				isHighlighted = !isHighlighted;

				if (!shouldHighlight) return part;

				const key = `${part}-${highlightCount}`;
				highlightCount += 1;
				return (
					<span key={key} className="bg-yellow-200 dark:bg-yellow-600">
						{part}
					</span>
				);
			})}
		</span>
	);
};

export const UserTable = ({
	data,
	onDeleteItem,
	onEditItem,
	searchTerm,
	canDelete = false,
}) => {
	const [deleteConfirm, setDeleteConfirm] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState("");

	const handleDeleteRequest = (userId) => {
		setDeleteError("");
		setDeleteConfirm(userId);
	};

	const handleConfirmDelete = async () => {
		if (!deleteConfirm || isDeleting) return;

		setIsDeleting(true);
		setDeleteError("");
		try {
			await onDeleteItem(deleteConfirm);
			setDeleteConfirm(null);
		} catch {
			setDeleteError("Failed to delete user. Please try again.");
		} finally {
			setIsDeleting(false);
		}
	};

	if (!data.length) {
		return (
			<div className="flex min-h-[240px] flex-col items-center justify-center">
				<Users className="mb-4 text-5xl text-gray-400" />
				<h2 className="mb-2 text-xl font-semibold">No users found</h2>
			</div>
		);
	}

	return (
		<div
			id="admin-table"
			className="m-0 overflow-hidden rounded-2xl bg-white shadow-sm md:border md:border-slate-200 dark:bg-gray-900 md:dark:border-gray-800"
		>
			<table className="w-full border-separate border-spacing-0 md:border-collapse">
				<thead className="hidden md:table-header-group">
					<tr className="bg-secondary text-left text-sm text-white">
						{["Sl.", "Name", "Number", "Status", "Created At", "Actions"].map(
							(heading) => (
								<th className="p-4 font-bold" key={heading}>
									{heading}
								</th>
							),
						)}
					</tr>
				</thead>
				<tbody className="block md:table-row-group">
					{data.map((item, index) => (
						<tr
							className="group mb-4 block bg-transparent transition md:mb-0 md:table-row dark:text-white"
							key={item._id}
						>
							<td className="flex items-center justify-between border-x-2 border-b-2 border-slate-200 bg-white p-2 text-right text-sm transition first:rounded-t-lg first:border-t-2 last:rounded-b-lg group-hover:bg-emerald-50/40 md:table-cell md:border-x-0 md:border-t-0 md:border-b md:border-slate-200 md:p-4 md:text-left md:first:rounded-none md:last:rounded-none md:group-hover:bg-emerald-50/40 dark:border-gray-700 dark:bg-gray-900 md:dark:border-gray-800 dark:group-hover:bg-gray-800/80">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Sl.
								</span>
								{index + 1}
							</td>
							<td className="flex items-center justify-between border-x-2 border-b-2 border-slate-200 bg-white p-2 text-right text-sm transition first:rounded-t-lg first:border-t-2 last:rounded-b-lg group-hover:bg-emerald-50/40 md:table-cell md:border-x-0 md:border-t-0 md:border-b md:border-slate-200 md:p-4 md:text-left md:first:rounded-none md:last:rounded-none md:group-hover:bg-emerald-50/40 dark:border-gray-700 dark:bg-gray-900 md:dark:border-gray-800 dark:group-hover:bg-gray-800/80">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Name
								</span>
								{getHighlightedText(item.name, searchTerm)}
							</td>
							<td className="flex items-center justify-between border-x-2 border-b-2 border-slate-200 bg-white p-2 text-right text-sm transition first:rounded-t-lg first:border-t-2 last:rounded-b-lg group-hover:bg-emerald-50/40 md:table-cell md:border-x-0 md:border-t-0 md:border-b md:border-slate-200 md:p-4 md:text-left md:first:rounded-none md:last:rounded-none md:group-hover:bg-emerald-50/40 dark:border-gray-700 dark:bg-gray-900 md:dark:border-gray-800 dark:group-hover:bg-gray-800/80">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Number
								</span>
								{getHighlightedText(item.number, searchTerm)}
							</td>
							<td className="flex items-center justify-between border-x-2 border-b-2 border-slate-200 bg-white p-2 text-right text-sm transition first:rounded-t-lg first:border-t-2 last:rounded-b-lg group-hover:bg-emerald-50/40 md:table-cell md:border-x-0 md:border-t-0 md:border-b md:border-slate-200 md:p-4 md:text-left md:first:rounded-none md:last:rounded-none md:group-hover:bg-emerald-50/40 dark:border-gray-700 dark:bg-gray-900 md:dark:border-gray-800 dark:group-hover:bg-gray-800/80">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Status
								</span>
								{item.isActive ? (
									<span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
										Active
									</span>
								) : (
									<span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-400">
										Inactive
									</span>
								)}
							</td>
							<td className="flex items-center justify-between border-x-2 border-b-2 border-slate-200 bg-white p-2 text-right text-sm transition first:rounded-t-lg first:border-t-2 last:rounded-b-lg group-hover:bg-emerald-50/40 md:table-cell md:border-x-0 md:border-t-0 md:border-b md:border-slate-200 md:p-4 md:text-left md:first:rounded-none md:last:rounded-none md:group-hover:bg-emerald-50/40 dark:border-gray-700 dark:bg-gray-900 md:dark:border-gray-800 dark:group-hover:bg-gray-800/80">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Created At
								</span>
								{formateDate(item.createdAt)}
							</td>
							<td className="flex items-center justify-between border-x-2 border-b-2 border-slate-200 bg-white p-2 text-right text-sm transition first:rounded-t-lg first:border-t-2 last:rounded-b-lg group-hover:bg-emerald-50/40 md:table-cell md:border-x-0 md:border-t-0 md:border-b md:border-slate-200 md:p-4 md:text-left md:first:rounded-none md:last:rounded-none md:group-hover:bg-emerald-50/40 dark:border-gray-700 dark:bg-gray-900 md:dark:border-gray-800 dark:group-hover:bg-gray-800/80">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Actions
								</span>
								<div className="flex items-center gap-2">
									{onEditItem && (
										<button
											type="button"
											onClick={(event) => {
												event.stopPropagation();
												onEditItem(item._id);
											}}
											aria-label={`Edit ${item.name}`}
											className="inline-flex items-center gap-1 rounded-xl bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
										>
											<Pencil aria-hidden="true" className="size-3.5" />
											<span className="hidden sm:inline">Edit</span>
										</button>
									)}
									{canDelete && (
										<button
											type="button"
											onClick={(event) => {
												event.stopPropagation();
												handleDeleteRequest(item._id);
											}}
											className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
										>
											<Trash2 className="size-3.5" />
											<span className="hidden sm:inline">Delete</span>
										</button>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{deleteError && (
				<p
					className="mb-3 px-4 text-sm font-semibold text-rose-600"
					role="alert"
				>
					{deleteError}
				</p>
			)}

			{deleteConfirm && (
				<DeleteModal
					itemName="user"
					onCancel={() => setDeleteConfirm(null)}
					onConfirm={handleConfirmDelete}
					isConfirming={isDeleting}
				/>
			)}
		</div>
	);
};
