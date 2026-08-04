import { ShieldCheck, X } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";

export type AdminFormData = {
	name: string;
	number: string;
	password: string;
};

type AdminModalProps = {
	admin?: { name?: string; number?: string } | null;
	onCancel: () => void;
	onSubmit: (data: AdminFormData) => void | Promise<void>;
	isSubmitting?: boolean;
	error?: string;
};

const inputClass =
	"w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10";

export default function AdminModal({
	admin = null,
	onCancel,
	onSubmit,
	isSubmitting = false,
	error = "",
}: AdminModalProps) {
	const isEditing = Boolean(admin);
	const [form, setForm] = useState<AdminFormData>({
		name: admin?.name ?? "",
		number: admin?.number ?? "",
		password: "",
	});

	useEffect(() => {
		setForm({
			name: admin?.name ?? "",
			number: admin?.number ?? "",
			password: "",
		});
	}, [admin]);

	useEffect(() => {
		const overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = overflow;
		};
	}, []);

	const update = (field: keyof AdminFormData, value: string) =>
		setForm((current) => ({ ...current, [field]: value }));

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await onSubmit(form);
	};

	return (
		<div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
			<button
				aria-label="Close administrator dialog"
				className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-sm"
				disabled={isSubmitting}
				onClick={onCancel}
				type="button"
			/>
			<div className="relative w-full max-w-md rounded-2xl border border-white/70 bg-white p-6 shadow-2xl sm:p-7" role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title">
				<div className="mb-6 flex items-start justify-between gap-4">
					<div className="flex items-center gap-3">
						<span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-secondary">
							<ShieldCheck className="size-5" />
						</span>
						<div>
							<p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary/60">Access control</p>
							<h2 id="admin-dialog-title" className="text-xl font-extrabold text-secondary-dark">
								{isEditing ? "Edit administrator" : "Add administrator"}
							</h2>
						</div>
					</div>
					<button aria-label="Close administrator dialog" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" disabled={isSubmitting} onClick={onCancel} type="button">
						<X className="size-5" />
					</button>
				</div>
				<div className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
					New accounts are created with the <strong>Admin</strong> role.
				</div>
				<form className="space-y-4" onSubmit={submit}>
					<label className="block text-sm font-bold text-slate-700" htmlFor="admin-name">Name<input id="admin-name" className={`${inputClass} mt-2`} value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="Enter administrator name" required /></label>
					<label className="block text-sm font-bold text-slate-700" htmlFor="admin-number">Number<input id="admin-number" className={`${inputClass} mt-2`} inputMode="numeric" type="tel" value={form.number} onChange={(event: ChangeEvent<HTMLInputElement>) => update("number", event.target.value)} placeholder="Enter administrator number" required /></label>
					<label className="block text-sm font-bold text-slate-700" htmlFor="admin-password">Password<input id="admin-password" className={`${inputClass} mt-2`} type="password" value={form.password} onChange={(event) => update("password", event.target.value)} minLength={isEditing ? undefined : 6} placeholder={isEditing ? "Leave blank to keep current password" : "At least 6 characters"} required={!isEditing} /></label>
					{error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">{error}</p>}
					<div className="flex justify-end gap-3 pt-2">
						<button className="rounded-xl bg-slate-100 px-4 py-2.5 font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50" disabled={isSubmitting} onClick={onCancel} type="button">Cancel</button>
						<button className="rounded-xl bg-secondary px-4 py-2.5 font-bold text-white shadow-lg shadow-secondary/20 transition hover:bg-secondary-dark disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create admin"}</button>
					</div>
				</form>
			</div>
		</div>
	);
}
