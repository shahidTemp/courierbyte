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

const StatusBadge = ({ isActive }) =>
	isActive ? (
		<span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
			Active
		</span>
	) : (
		<span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-400">
			Inactive
		</span>
	);

const ActionButtons = ({ item, onEditItem, canDelete, onDelete }) => (
	<div className="flex flex-wrap items-center justify-end gap-2 sm:flex-nowrap">
		{onEditItem && (
			<button
				type="button"
				onClick={() => onEditItem(item._id)}
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
				onClick={() => onDelete(item._id)}
				aria-label={`Delete ${item.name}`}
				className="inline-flex items-center gap-1 rounded-xl bg-red-50 px-3 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
			>
				<Trash2 aria-hidden="true" className="size-3.5" />
				<span className="hidden sm:inline">Delete</span>
			</button>
		)}
	</div>
);

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
		<div id="admin-table" className="m-0">
			{/* Mobile cards: separate from the table so card borders and corners are never affected by table layout. */}
			<div className="space-y-4 md:hidden">
				{data.map((item, index) => (
					<article
						className="overflow-hidden rounded-lg border-2 border-slate-200 bg-white shadow-sm transition hover:border-secondary/40 hover:shadow-md dark:border-gray-700 dark:bg-gray-900"
						key={item._id}
					>
						<div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-800">
							<span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-gray-400">
								User #{index + 1}
							</span>
							<StatusBadge isActive={item.isActive} />
						</div>
						<div>
							<MobileField label="Name">
								{getHighlightedText(item.name, searchTerm)}
							</MobileField>
							<MobileField label="Number">
								{getHighlightedText(item.number, searchTerm)}
							</MobileField>
							<MobileField label="Created At">
								{formateDate(item.createdAt)}
							</MobileField>
							<MobileField label="Actions">
								<ActionButtons
									item={item}
									onEditItem={onEditItem}
									canDelete={canDelete}
									onDelete={handleDeleteRequest}
								/>
							</MobileField>
						</div>
					</article>
				))}
			</div>

			{/* Desktop table: remains a normal table and does not use block-level table rows. */}
			<div className="hidden overflow-hidden rounded-2xl bg-white shadow-sm md:block md:border md:border-slate-200 dark:bg-gray-900 md:dark:border-gray-800">
				<table className="w-full border-collapse">
					<thead>
						<tr className="bg-secondary text-left text-sm text-white">
							{["Sl.", "Name", "Number", "Status", "Created At", "Actions"].map(
								(heading, index) => (
									<th
										className={`p-4 font-bold ${index === 0 ? "rounded-tl-2xl" : ""} ${index === 5 ? "rounded-tr-2xl" : ""}`}
										key={heading}
									>
										{heading}
									</th>
								),
							)}
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
								<td className="border-b border-slate-200 p-4 font-bold dark:border-gray-700">
									{getHighlightedText(item.name, searchTerm)}
								</td>
								<td className="border-b border-slate-200 p-4 dark:border-gray-700">
									{getHighlightedText(item.number, searchTerm)}
								</td>
								<td className="border-b border-slate-200 p-4 dark:border-gray-700">
									<StatusBadge isActive={item.isActive} />
								</td>
								<td className="border-b border-slate-200 p-4 text-slate-500 dark:border-gray-700 dark:text-gray-400">
									{formateDate(item.createdAt)}
								</td>
								<td className="border-b border-slate-200 p-4 dark:border-gray-700">
									<ActionButtons
										item={item}
										onEditItem={onEditItem}
										canDelete={canDelete}
										onDelete={handleDeleteRequest}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{deleteError && (
				<p
					className="mt-3 px-4 text-sm font-semibold text-rose-600"
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
