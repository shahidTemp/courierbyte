import { Pencil, Shield, Trash2, Users } from "lucide-react";
import { useState } from "react";
import DeleteModal from "@/components/common/deleteModal";
import { formateDate } from "@/utils/formateDate";

const getHighlightedText = (text, highlight) => {
	const safeText = text ? String(text) : "";
	const safeHighlight = highlight.trim();

	if (!safeHighlight || !safeText) return <span>{safeText}</span>;

	const escapeRegExp = (value: string) =>
		value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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
			className="m-0 overflow-x-auto rounded-2xl bg-white md:border md:border-gray-200 md:dark:border-gray-800 dark:bg-gray-900"
		>
			<table className="w-full border-collapse">
				<thead className="hidden md:table-header-group">
					<tr>
						{[
							"Sl.",
							"Name",
							"Number",
							"Status",
							"Role",
							"Created At",
							"Actions",
						].map((heading) => (
							<th
								className="bg-[#273c75] p-4 text-left text-white"
								key={heading}
							>
								{heading}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="block md:table-row-group">
					{data.map((item, index) => (
						<tr
							className="mb-4 block overflow-hidden rounded-lg border-2 border-b-2 hover:bg-gray-50 dark:hover:bg-gray-500 even:bg-gray-50 dark:even:bg-gray-800 md:mb-0 md:table-row md:border-0 md:border-b dark:text-white"
							key={item._id}
						>
							<td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Sl.
								</span>
								{index + 1}
							</td>
							<td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Name
								</span>
								{getHighlightedText(item.name, searchTerm)}
							</td>
							<td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Number
								</span>
								{getHighlightedText(item.number, searchTerm)}
							</td>
							<td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
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
							<td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Role
								</span>
								<span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
									<Shield className="size-3" />
									{item.role}
								</span>
							</td>
							<td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
								<span className="mr-4 font-semibold text-gray-700 md:hidden dark:text-white">
									Created At
								</span>
								{formateDate(item.createdAt)}
							</td>
							<td className="flex items-center justify-between border-b border-gray-200 p-2 text-right md:table-cell md:p-4 md:text-left">
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
											className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-800 transition hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
										>
											<Pencil className="size-3.5" />
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
											className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-sm font-medium text-red-800 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
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
