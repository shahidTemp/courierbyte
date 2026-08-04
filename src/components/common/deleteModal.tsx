import { AlertTriangle } from "lucide-react";
import { type MouseEvent, useEffect } from "react";

type DeleteModalProps = {
	onCancel: () => void;
	onConfirm: () => void | Promise<void>;
	itemName?: string;
	isConfirming?: boolean;
};

const DeleteModal = ({
	onCancel,
	onConfirm,
	itemName = "item",
	isConfirming = false,
}: DeleteModalProps) => {
	useEffect(() => {
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, []);

	const handleOutsideClick = (e: MouseEvent<HTMLButtonElement>) => {
		if (e.target === e.currentTarget) onCancel();
	};

	return (
		<div className="fixed inset-0 z-[999] flex items-center justify-center">
			<button
				aria-label="Close delete dialog"
				className="absolute inset-0 cursor-default bg-black/50"
				onClick={handleOutsideClick}
				type="button"
			/>
			<div
				aria-labelledby="delete-dialog-title"
				aria-modal="true"
				className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:border dark:border-gray-700 dark:bg-gray-800"
				role="dialog"
			>
				<div className="mb-4 flex items-center">
					<div className="mr-3 flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30">
						<AlertTriangle className="size-6 text-rose-500" />
					</div>
					<h2
						className="text-lg font-bold capitalize text-gray-800 dark:text-gray-100"
						id="delete-dialog-title"
					>
						Delete {itemName}
					</h2>
				</div>
				<p className="mb-6 text-gray-600 dark:text-gray-300">
					Are you sure you want to delete this {itemName.toLowerCase()}? This
					action cannot be undone.
				</p>
				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={onCancel}
						className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
					>
						Cancel
					</button>
					<button
						type="button"
						disabled={isConfirming}
						onClick={onConfirm}
						className="cursor-pointer rounded-lg bg-rose-500 px-4 py-2 font-medium text-white hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isConfirming ? "Deleting..." : "Confirm"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteModal;
