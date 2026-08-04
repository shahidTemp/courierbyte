import { UserRound, X } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";

export type UserFormData = {
	name: string;
	number: string;
	password: string;
};

type UserModalUser = {
	name?: string;
	number?: string;
};

type UserModalProps = {
	onCancel: () => void;
	onSubmit: (data: UserFormData) => void | Promise<void>;
	user?: UserModalUser | null;
	isSubmitting?: boolean;
	error?: string;
};

const emptyFormData: UserFormData = {
	name: "",
	number: "",
	password: "",
};

const UserModal = ({
	onCancel,
	onSubmit,
	user = null,
	isSubmitting = false,
	error = "",
}: UserModalProps) => {
	const isEditing = Boolean(user);
	const [formData, setFormData] = useState<UserFormData>(() => ({
		name: user?.name ?? "",
		number: user?.number ?? "",
		password: "",
	}));

	useEffect(() => {
		setFormData(
			user
				? {
						name: user.name ?? "",
						number: user.number ?? "",
						password: "",
					}
				: emptyFormData,
		);
	}, [user]);

	useEffect(() => {
		const originalOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = originalOverflow;
		};
	}, []);

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await onSubmit(formData);
	};

	const updateField = (
		field: keyof UserFormData,
		value: ChangeEvent<HTMLInputElement>["target"]["value"],
	) => {
		setFormData((currentData) => ({ ...currentData, [field]: value }));
	};

	return (
		<div className="fixed inset-0 z-[999] flex items-center justify-center">
			<button
				aria-label={`Close ${isEditing ? "edit" : "create"} user dialog`}
				className="absolute inset-0 cursor-default bg-black/50 disabled:cursor-not-allowed"
				disabled={isSubmitting}
				onClick={onCancel}
				type="button"
			/>
			<div
				aria-labelledby="user-dialog-title"
				aria-modal="true"
				className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:border dark:border-gray-700 dark:bg-gray-800"
				role="dialog"
			>
				<div className="mb-5 flex items-center justify-between">
					<div className="flex items-center">
						<div className="mr-3 flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
							<UserRound className="size-5 text-secondary" />
						</div>
						<h2
							className="text-lg font-bold text-gray-800 dark:text-gray-100"
							id="user-dialog-title"
						>
							{isEditing ? "Edit user" : "Add user"}
						</h2>
					</div>
					<button
						aria-label={`Close ${isEditing ? "edit" : "create"} user dialog`}
						className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700 dark:hover:text-gray-200"
						disabled={isSubmitting}
						onClick={onCancel}
						type="button"
					>
						<X className="size-5" />
					</button>
				</div>

				<form className="space-y-4" onSubmit={handleSubmit}>
					<div>
						<label
							className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200"
							htmlFor="user-name"
						>
							Name
						</label>
						<input
							className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700"
							id="user-name"
							name="name"
							onChange={(event) => updateField("name", event.target.value)}
							placeholder="Enter user's name"
							required
							type="text"
							value={formData.name}
						/>
					</div>

					<div>
						<label
							className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200"
							htmlFor="user-number"
						>
							Number
						</label>
						<input
							className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700"
							id="user-number"
							inputMode="numeric"
							name="number"
							onChange={(event) => updateField("number", event.target.value)}
							placeholder="Enter user's number"
							required
							type="tel"
							value={formData.number}
						/>
					</div>

					<div>
						<label
							className="mb-1.5 block text-sm font-semibold text-gray-700 dark:text-gray-200"
							htmlFor="user-password"
						>
							Password
						</label>
						<input
							className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:bg-gray-700"
							id="user-password"
							name="password"
							onChange={(event) => updateField("password", event.target.value)}
							minLength={isEditing ? undefined : 6}
							placeholder={
								isEditing
									? "Leave blank to keep current password"
									: "At least 6 characters"
							}
							required={!isEditing}
							type="password"
							value={formData.password}
						/>
					</div>

					{error && (
						<p
							className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-600"
							role="alert"
						>
							{error}
						</p>
					)}

					<div className="flex justify-end gap-3 pt-2">
						<button
							className="rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
							disabled={isSubmitting}
							onClick={onCancel}
							type="button"
						>
							Cancel
						</button>
						<button
							className="rounded-lg bg-secondary px-4 py-2 font-medium text-white transition-colors hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:cursor-not-allowed disabled:opacity-60"
							disabled={isSubmitting}
							type="submit"
						>
							{isSubmitting
								? isEditing
									? "Saving..."
									: "Creating..."
								: isEditing
									? "Save changes"
									: "Create user"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default UserModal;
