// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { createPackage } from "@/server/functions/package.fn";

export const Route = createFileRoute("/admin/package/add")({
	component: AddPackage,
});

const inputClass =
	"w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10";

const emptyForm = {
	name: "",
	description: "",
	price: "",
	yearly_price: "",
	duration_in_days: "",
	api_call_limit: "",
	features: "",
	is_active: true,
};

function Field({ label, htmlFor, children }) {
	return (
		<div>
			<label
				htmlFor={htmlFor}
				className="mb-2 block text-sm font-bold text-slate-700"
			>
				{label}
			</label>
			{children}
		</div>
	);
}

function AddPackage() {
	const [form, setForm] = useState(emptyForm);
	const [message, setMessage] = useState({ type: "", text: "" });
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (event) => {
		const { name, type, value, checked } = event.target;
		setForm((current) => ({
			...current,
			[name]: type === "checkbox" ? checked : value,
		}));
		setMessage({ type: "", text: "" });
	};

	const handleReset = () => {
		setForm(emptyForm);
		setMessage({ type: "", text: "" });
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		const features = form.features
			.split("\n")
			.map((feature) => feature.trim())
			.filter(Boolean);

		if (
			features.length > 50 ||
			features.some((feature) => feature.length > 200)
		) {
			setMessage({
				type: "error",
				text: "Add up to 50 features, with no more than 200 characters per feature.",
			});
			return;
		}

		setIsSubmitting(true);
		setMessage({ type: "", text: "" });

		try {
			await createPackage({
				data: {
					name: form.name.trim(),
					description: form.description.trim(),
					price: Number(form.price),
					yearly_price: Number(form.yearly_price),
					duration_in_days: Number(form.duration_in_days),
					api_call_limit: Number(form.api_call_limit),
					features,
					is_active: form.is_active,
				},
			});
			setForm(emptyForm);
			setMessage({ type: "success", text: "Package added successfully." });
		} catch (error) {
			setMessage({
				type: "error",
				text:
					error instanceof Error
						? error.message
						: "The package could not be added. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
			<div className="mx-auto max-w-2xl">
				<h1 className="text-3xl font-extrabold tracking-tight text-secondary-dark">
					Add New Package
				</h1>
				<p className="mt-2 text-sm text-slate-500">
					Enter the package details and submit the form.
				</p>

				<form
					onSubmit={handleSubmit}
					className="mt-8 space-y-5 rounded-2xl border border-secondary/10 bg-white p-6 shadow-xl shadow-secondary/10 sm:p-8"
				>
					<Field label="Package Name" htmlFor="name">
						<input
							id="name"
							name="name"
							type="text"
							value={form.name}
							onChange={handleChange}
							className={inputClass}
							placeholder="e.g. Grow"
							required
							maxLength={100}
						/>
					</Field>

					<Field label="Description" htmlFor="description">
						<textarea
							id="description"
							name="description"
							value={form.description}
							onChange={handleChange}
							className={`${inputClass} min-h-28 resize-y`}
							placeholder="Enter a short description of the package."
							required
							maxLength={2000}
						/>
					</Field>

					<div className="grid gap-5 sm:grid-cols-2">
						<Field label="Monthly Price" htmlFor="price">
							<input
								id="price"
								name="price"
								type="text"
								value={form.price}
								inputMode="numeric"
								onChange={handleChange}
								className={inputClass}
								placeholder="0"
								required
							/>
						</Field>

						<Field label="Yearly Price" htmlFor="yearly_price">
							<input
								id="yearly_price"
								name="yearly_price"
								type="text"
								value={form.yearly_price}
								inputMode="numeric"
								onChange={handleChange}
								className={inputClass}
								placeholder="0"
								required
							/>
						</Field>

						<Field label="Duration (Days)" htmlFor="duration_in_days">
							<input
								id="duration_in_days"
								name="duration_in_days"
								type="text"
								value={form.duration_in_days}
								inputMode="numeric"
								onChange={handleChange}
								className={inputClass}
								placeholder="30"
								required
							/>
						</Field>

						<Field label="API Call Limit" htmlFor="api_call_limit">
							<input
								id="api_call_limit"
								name="api_call_limit"
								type="text"
								value={form.api_call_limit}
								inputMode="numeric"
								onChange={handleChange}
								className={inputClass}
								placeholder="500"
								required
							/>
						</Field>
					</div>

					<Field label="Features" htmlFor="features">
						<textarea
							id="features"
							name="features"
							value={form.features}
							onChange={handleChange}
							className={`${inputClass} min-h-28 resize-y`}
							placeholder="Enter one feature per line."
						/>
					</Field>

					<label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
						<input
							name="is_active"
							type="checkbox"
							checked={form.is_active}
							onChange={handleChange}
							className="h-4 w-4 accent-secondary"
						/>
						Keep package active
					</label>

					{message.text ? (
						<p
							role={message.type === "error" ? "alert" : "status"}
							className={`rounded-xl px-4 py-3 text-sm font-semibold ${
								message.type === "error"
									? "bg-rose-50 text-rose-700"
									: "bg-emerald-50 text-emerald-700"
							}`}
						>
							{message.text}
						</p>
					) : null}

					<div className="flex flex-col gap-3 sm:flex-row">
						<button
							type="button"
							onClick={handleReset}
							className="w-full rounded-xl border border-secondary/20 px-4 py-3 font-bold text-secondary transition hover:bg-secondary/10 focus:outline-none focus:ring-4 focus:ring-secondary/25 sm:w-1/3"
						>
							Reset
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="w-full rounded-xl bg-secondary px-4 py-3 font-bold text-white shadow-lg shadow-secondary/20 transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/25 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
						>
							{isSubmitting ? "Adding..." : "Add Package"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
