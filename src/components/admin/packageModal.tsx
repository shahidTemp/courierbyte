import { Package, Plus, Trash2, X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

export type PackageFormData = {
	name: string;
	description: string;
	price: string;
	yearly_price: string;
	duration_in_days: string;
	api_call_limit: string;
	features: string[];
	is_active: boolean;
};

type PackageItem = Partial<PackageFormData> & { _id?: string };
type PackageModalProps = {
	packageItem?: PackageItem | null;
	onCancel: () => void;
	onSubmit: (data: PackageFormData) => void | Promise<void>;
	isSubmitting?: boolean;
	error?: string;
};
type NumericField = "price" | "yearly_price" | "duration_in_days" | "api_call_limit";

const emptyForm: PackageFormData = {
	name: "",
	description: "",
	price: "",
	yearly_price: "",
	duration_in_days: "",
	api_call_limit: "",
	features: [""],
	is_active: true,
};
const numericFields: Array<{ field: NumericField; label: string; placeholder: string }> = [
	{ field: "price", label: "Monthly price", placeholder: "0" },
	{ field: "yearly_price", label: "Yearly price", placeholder: "0" },
	{ field: "duration_in_days", label: "Duration (days)", placeholder: "30" },
	{ field: "api_call_limit", label: "API call limit", placeholder: "500" },
];
const inputClass =
	"w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10";

const toForm = (item?: PackageItem | null): PackageFormData =>
	item
		? {
				name: String(item.name ?? ""),
				description: String(item.description ?? ""),
				price: String(item.price ?? ""),
				yearly_price: String(item.yearly_price ?? ""),
				duration_in_days: String(item.duration_in_days ?? ""),
				api_call_limit: String(item.api_call_limit ?? ""),
				features: item.features?.length ? item.features.map(String) : [""],
				is_active: item.is_active ?? true,
			}
		: emptyForm;

export default function PackageModal({
	packageItem = null,
	onCancel,
	onSubmit,
	isSubmitting = false,
	error = "",
}: PackageModalProps) {
	const isEditing = Boolean(packageItem);
	const [form, setForm] = useState(() => toForm(packageItem));

	useEffect(() => setForm(toForm(packageItem)), [packageItem]);
	useEffect(() => {
		const overflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = overflow;
		};
	}, []);

	const update = <K extends keyof PackageFormData>(field: K, value: PackageFormData[K]) =>
		setForm((current) => ({ ...current, [field]: value }));
	const updateFeature = (index: number, value: string) =>
		setForm((current) => ({
			...current,
			features: current.features.map((feature, position) =>
				position === index ? value : feature,
			),
		}));
	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await onSubmit(form);
	};

	return (
		<div className="fixed inset-0 z-[999] overflow-y-auto p-4">
			<button aria-label="Close package dialog" className="fixed inset-0 cursor-default bg-slate-950/55 backdrop-blur-sm" disabled={isSubmitting} onClick={onCancel} type="button" />
			<div className="flex min-h-full items-center justify-center">
				<div className="relative my-8 w-full max-w-3xl rounded-2xl border border-white/70 bg-white p-6 shadow-2xl sm:p-8" role="dialog" aria-modal="true" aria-labelledby="package-dialog-title">
				<div className="mb-6 flex items-start justify-between gap-4">
					<div className="flex items-center gap-3"><span className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700"><Package className="size-5" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-secondary/60">Catalog</p><h2 id="package-dialog-title" className="text-xl font-extrabold text-secondary-dark">{isEditing ? "Edit package" : "Add package"}</h2></div></div>
					<button aria-label="Close package dialog" className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" disabled={isSubmitting} onClick={onCancel} type="button"><X className="size-5" /></button>
				</div>
				<form className="space-y-5" onSubmit={submit}>
					<div className="grid gap-5 md:grid-cols-2">
						<label className="text-sm font-bold text-slate-700 md:col-span-2" htmlFor="package-name">Package name<input id="package-name" className={`${inputClass} mt-2`} value={form.name} onChange={(event) => update("name", event.target.value)} maxLength={100} placeholder="e.g. Growth" required /></label>
						<label className="text-sm font-bold text-slate-700 md:col-span-2" htmlFor="package-description">Description<textarea id="package-description" className={`${inputClass} mt-2 min-h-24 resize-y`} value={form.description} onChange={(event) => update("description", event.target.value)} maxLength={2000} placeholder="Describe what this package includes" required /></label>
						{numericFields.map(({ field, label, placeholder }) => <label className="text-sm font-bold text-slate-700" htmlFor={`package-${field}`} key={field}>{label}<input id={`package-${field}`} className={`${inputClass} mt-2`} type="text" inputMode="numeric" value={form[field]} onChange={(event) => update(field, event.target.value)} placeholder={placeholder} required /></label>)}
					</div>
					<div><div className="mb-2 flex items-center justify-between"><span className="text-sm font-bold text-slate-700">Features</span><button type="button" disabled={form.features.length >= 50} onClick={() => update("features", [...form.features, ""])} className="inline-flex items-center gap-1 text-sm font-bold text-secondary hover:text-secondary-dark disabled:opacity-50"><Plus className="size-4" /> Add feature</button></div><div className="max-h-72 space-y-3 overflow-y-auto pr-2">{form.features.map((feature, index) => <div
										className="flex gap-2"
										// biome-ignore lint/suspicious/noArrayIndexKey: feature rows are position-controlled
										key={index}
									><input className={inputClass} value={feature} onChange={(event) => updateFeature(index, event.target.value)} maxLength={200} placeholder={`Feature ${index + 1}`} required aria-label={`Feature ${index + 1}`} /><button type="button" aria-label={`Remove feature ${index + 1}`} disabled={form.features.length === 1} onClick={() => update("features", form.features.filter((_, position) => position !== index))} className="rounded-xl border border-rose-200 px-3 text-rose-600 transition hover:bg-rose-50 disabled:opacity-40"><Trash2 className="size-4" /></button></div>)}</div></div>
					<label className="flex items-center gap-3 text-sm font-bold text-slate-700"><input className="size-4 accent-secondary" type="checkbox" checked={form.is_active} onChange={(event) => update("is_active", event.target.checked)} />Keep package active</label>
					{error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700" role="alert">{error}</p>}
					<div className="flex justify-end gap-3 pt-2"><button className="rounded-xl bg-slate-100 px-4 py-2.5 font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50" disabled={isSubmitting} onClick={onCancel} type="button">Cancel</button><button className="rounded-xl bg-secondary px-4 py-2.5 font-bold text-white shadow-lg shadow-secondary/20 transition hover:bg-secondary-dark disabled:opacity-60" disabled={isSubmitting} type="submit">{isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Create package"}</button></div>
				</form>
				</div>
			</div>
		</div>
	);
}
