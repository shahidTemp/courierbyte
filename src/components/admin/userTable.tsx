import { Pencil, Shield, Trash2, Users } from "lucide-react";
import { useState } from "react";
import DeleteModal from "@/components/common/deleteModal";
import { formateDate } from "@/utils/formateDate";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getHighlightedText = (text, highlight) => {
	const safeText = text ? String(text) : "";
	const safeHighlight = highlight?.trim() ?? "";

	if (!safeHighlight || !safeText) {
		return <span>{safeText}</span>;
	}

	const escapeRegExp = (value = "") =>
		value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	const regex = new RegExp(`(${escapeRegExp(safeHighlight)})`, "gi");
	const parts = safeText.split(regex);

	return (
		<span>
			{parts.map((part, i) =>
				i % 2 === 1 ? (
					<span key={i} className="bg-yellow-200 dark:bg-yellow-600">
						{part}
					</span>
				) : (
					part
				),
			)}
		</span>
	);
};

// ─── Table Component ─────────────────────────────────────────────────────────

export const UserTable = ({ data, onDeleteItem, onEditItem, searchTerm }) => {
	const [deleteConfirm, setDeleteConfirm] = useState(null);

	const handleDeleteRequest = (adminId) => {
		setDeleteConfirm(adminId);
	};

	const handleConfirmDelete = async () => {
		try {
			await onDeleteItem(deleteConfirm);
			setDeleteConfirm(null);
		} catch {
			alert("Failed to delete admin");
		}
	};

	const handleCancelDelete = () => {
		setDeleteConfirm(null);
	};

	// ── Empty state ───────────────────────────────────────────────────────

	if (!data || data.length < 1) {
		return (
			<div className="flex min-h-[240px] flex-col items-center justify-center">
				<Users className="mb-4 text-5xl text-gray-400" />
				<h2 className="mb-2 text-xl font-semibold">No admin found</h2>
			</div>
		);
	}

	// ── Render ────────────────────────────────────────────────────────────

	return (
		<div
			id="admin-table"
			className="m-0 overflow-x-auto rounded-2xl md:border md:border-gray-200 bg-white md:dark:border-gray-800 dark:bg-gray-900"
		>
			<table className="w-full border-collapse">
				<thead className="hidden md:table-header-group">
					<tr>
						<th className="bg-[#273c75] p-4 text-left text-white">Sl.</th>
						<th className="bg-[#273c75] p-4 text-left text-white">Name</th>
						<th className="bg-[#273c75] p-4 text-left text-white">Number</th>
						<th className="bg-[#273c75] p-4 text-left text-white">Status</th>
						<th className="bg-[#273c75] p-4 text-left text-white">Role</th>
						<th className="bg-[#273c75] p-4 text-left text-white">
							Created At
						</th>
						<th className="bg-[#273c75] p-4 text-left text-white">Actions</th>
					</tr>
				</thead>
				<tbody className="block md:table-row-group">
					{data.map((item, index) => (
						<tr
							key={item._id ?? index}
							className="mb-4 block rounded-lg border-2  border-b-2 overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-500 even:bg-gray-50 dark:even:bg-gray-800 md:mb-0 md:table-row md:border-0 md:border-b dark:text-white"
						>
							{/* SL */}
							<td className="flex items-center bg-green-60 justify-between border-b  border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Sl.
								</span>
								{index + 1}
							</td>

							{/* Name */}
							<td className="flex items-center justify-between  border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Name
								</span>
								{getHighlightedText(item?.name, searchTerm)}
							</td>

							{/* Number */}
							<td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Number
								</span>
								{getHighlightedText(item?.number, searchTerm)}
							</td>

							{/* Status */}
							<td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Status
								</span>
								{item?.isActive ? (
									<span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
										Active
									</span>
								) : (
									<span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-400">
										Inactive
									</span>
								)}
							</td>

							{/* Role */}
							<td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Role
								</span>
								<span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
									<Shield className="size-3" />
									{item?.role ?? "—"}
								</span>
							</td>

							{/* Created At */}
							<td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Created At
								</span>
								{formateDate(item.createdAt)}
							</td>

							{/* Actions */}
							<td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Actions
								</span>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											onEditItem?.(item._id);
										}}
										className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
									>
										<Pencil className="size-3.5" />
										<span className="hidden sm:inline">Edit</span>
									</button>
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteRequest(item._id);
										}}
										className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
									>
										<Trash2 className="size-3.5" />
										<span className="hidden sm:inline">Delete</span>
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{deleteConfirm && (
				<DeleteModal
					itemName="admin"
					onCancel={handleCancelDelete}
					onConfirm={handleConfirmDelete}
				/>
			)}
		</div>
	);
};
