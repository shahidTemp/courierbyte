import { KeyRound, X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

export type KeyFormData = {
	keyValue: string;
	dailyLimit: string;
	status: "active" | "inactive";
};

type KeyItem = {
	_id?: string;
	dailyLimit?: number;
	status?: "active" | "inactive";
};

type KeyModalProps = {
	onCancel: () => void;
	onSubmit: (data: KeyFormData) => void | Promise<void>;
	keyItem?: KeyItem | null;
	isSubmitting?: boolean;
	error?: string;
};

const inputClass =
	"w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700";

export default function KeyModal({
	onCancel,
	onSubmit,
	keyItem = null,
	isSubmitting = false,
	error = "",
}: KeyModalProps) {
	const isEditing = Boolean(keyItem);
	const [form, setForm] = useState<KeyFormData>(() => ({
		keyValue: "",
		dailyLimit: String(keyItem?.dailyLimit ?? 50),
		status: keyItem?.status ?? "active",
	}));

	useEffect(() => {
		setForm({
			keyValue: "",
			dailyLimit: String(keyItem?.dailyLimit ?? 50),
			status: keyItem?.status ?? "active",
		});
	}, [keyItem]);

	useEffect(() => {
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, []);

	const update = (field: keyof KeyFormData, value: string) =>
		setForm((current) => ({ ...current, [field]: value }));

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await onSubmit(form);
	};

	return (
		<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
			<button
				aria-label="Close key dialog"
				className="absolute inset-0 cursor-default bg-black/50 disabled:cursor-not-allowed"
				disabled={isSubmitting}
				onClick={onCancel}
				type="button"
			/>
			<div
				aria-labelledby="key-dialog-title"
				aria-modal="true"
				className="relative w-full max-w-md rounded-2xl border border-white/70 bg-white p-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800 sm:p-8"
				role="dialog"
			>
				<div className="mb-6 flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
							<KeyRound className="size-5" />
						</span>
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary/60">
								Courier API
							</p>
							<h2
								id="key-dialog-title"
								className="text-xl font-extrabold text-secondary-dark dark:text-white"
							>
								{isEditing ? "Edit key" : "Add key"}
							</h2>
						</div>
					</div>
					<button
						aria-label="Close key dialog"
						className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-gray-700 dark:hover:text-gray-200"
						disabled={isSubmitting}
						onClick={onCancel}
						type="button"
					>
						<X className="size-5" />
					</button>
				</div>

				<form className="space-y-5" onSubmit={handleSubmit}>
					<label
						className="block text-sm font-bold text-slate-700 dark:text-gray-200"
						htmlFor="key-value"
					>
						Key value
						<input
							id="key-value"
							className={`${inputClass} mt-2 font-mono`}
							placeholder={
								isEditing
									? "Leave blank to keep current key"
									: "Paste the courier API key"
							}
							required={!isEditing}
							type="password"
							autoComplete="off"
							autoCorrect="off"
							spellCheck={false}
							value={form.keyValue}
							onChange={(event) => update("keyValue", event.target.value)}
						/>
					</label>
					<label
						className="block text-sm font-bold text-slate-700 dark:text-gray-200"
						htmlFor="key-daily-limit"
					>
						Daily limit
						<input
							id="key-daily-limit"
							className={`${inputClass} mt-2`}
							inputMode="numeric"
							min={1}
							required
							type="number"
							value={form.dailyLimit}
							onChange={(event) => update("dailyLimit", event.target.value)}
						/>
						<span className="mt-1.5 block text-xs font-medium text-slate-400 dark:text-gray-400">
							Requests this key is allowed per day.
						</span>
					</label>
					<label
						className="block text-sm font-bold text-slate-700 dark:text-gray-200"
						htmlFor="key-status"
					>
						Status
						<select
							id="key-status"
							className={`${inputClass} mt-2 cursor-pointer`}
							value={form.status}
							onChange={(event) =>
								update("status", event.target.value as KeyFormData["status"])
							}
						>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
						</select>
						<span className="mt-1.5 block text-xs font-medium text-slate-400 dark:text-gray-400">
							Inactive keys are revoked and skipped by the request pool.
						</span>
					</label>

					{error && (
						<p
							className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
							role="alert"
						>
							{error}
						</p>
					)}

					<div className="flex justify-end gap-3 pt-2">
						<button
							className="rounded-xl bg-slate-100 px-4 py-2.5 font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
							disabled={isSubmitting}
							onClick={onCancel}
							type="button"
						>
							Cancel
						</button>
						<button
							className="rounded-xl bg-secondary px-4 py-2.5 font-bold text-white shadow-lg shadow-secondary/20 transition hover:bg-secondary-dark disabled:opacity-60"
							disabled={isSubmitting}
							type="submit"
						>
							{isSubmitting
								? "Saving..."
								: isEditing
									? "Save changes"
									: "Add key"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
