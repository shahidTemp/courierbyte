// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import {
	BadgeCheck,
	Check,
	CircleAlert,
	CircleDollarSign,
	Clock,
	FileText,
	Gauge,
	Gem,
	ListChecks,
	LoaderCircle,
	PackagePlus,
	Plus,
	Power,
	Sparkles,
	X,
} from "lucide-react";
import { useState } from "react";
import { createPackage } from "@/server/functions/package.fn";
import { cn } from "@/utils/cssClassUtils";

export const Route = createFileRoute("/admin/package/add")({
	component: RouteComponent,
});

const NUMERIC_FIELDS = new Set([
	"price",
	"yearly_price",
	"duration_in_days",
	"api_call_limit",
]);

const inputClass =
	"h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10";

const formatBn = (value) => Number(value).toLocaleString("bn-BD");

const emptyForm = () => ({
	name: "",
	description: "",
	price: "",
	yearly_price: "",
	duration_in_days: "",
	api_call_limit: "",
	is_active: true,
});

function Field({ label, hint, htmlFor, children }) {
	return (
		<div>
			<div className="mb-2 flex items-baseline justify-between gap-3">
				<label htmlFor={htmlFor} className="text-sm font-bold text-slate-700">
					{label}
				</label>
				{hint ? (
					<span className="text-xs font-medium text-slate-400">{hint}</span>
				) : null}
			</div>
			{children}
		</div>
	);
}

function SectionTitle({ icon: Icon, title, description }) {
	return (
		<div className="mb-5 flex items-start gap-3">
			<span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
				<Icon className="h-4 w-4" aria-hidden="true" />
			</span>
			<div>
				<h2 className="font-extrabold text-secondary-dark">{title}</h2>
				{description ? (
					<p className="mt-0.5 text-sm text-slate-500">{description}</p>
				) : null}
			</div>
		</div>
	);
}

function PriceInput({ id, name, value, onChange, placeholder }) {
	return (
		<div className="relative">
			<span
				className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-extrabold text-secondary"
				aria-hidden="true"
			>
				৳
			</span>
			<input
				id={id}
				name={name}
				type="text"
				inputMode="numeric"
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className={cn(inputClass, "pl-9 font-bold")}
			/>
		</div>
	);
}

function Toggle({ checked, onChange, label, description }) {
	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			onClick={() => onChange(!checked)}
			className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-secondary/30 hover:bg-white focus:outline-none focus:ring-4 focus:ring-secondary/15"
		>
			<span>
				<span className="block text-sm font-bold text-slate-700">{label}</span>
				{description ? (
					<span className="mt-0.5 block text-xs text-slate-500">
						{description}
					</span>
				) : null}
			</span>
			<span
				aria-hidden="true"
				className={cn(
					"relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200",
					checked ? "bg-secondary" : "bg-slate-300",
				)}
			>
				<span
					className={cn(
						"absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-200",
						checked ? "left-6" : "left-1",
					)}
				/>
			</span>
		</button>
	);
}

function LivePreview({ form, features }) {
	return (
		<div className="relative overflow-hidden rounded-3xl border border-secondary/10 bg-white p-7 shadow-xl shadow-secondary/10">
			<div
				aria-hidden="true"
				className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent"
			/>
			<div className="mb-5 flex items-center justify-between gap-3">
				<span className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">
					লাইভ প্রিভিউ
				</span>
				<span
					className={cn(
						"inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
						form.is_active
							? "bg-emerald-50 text-emerald-700"
							: "bg-slate-100 text-slate-500",
					)}
				>
					<span
						className={cn(
							"h-1.5 w-1.5 rounded-full",
							form.is_active ? "bg-emerald-500" : "bg-slate-400",
						)}
					/>
					{form.is_active ? "সক্রিয়" : "নিষ্ক্রিয়"}
				</span>
			</div>

			<h3 className="text-xl font-extrabold tracking-tight text-slate-900">
				{form.name.trim() || "প্যাকেজের নাম"}
			</h3>
			<p className="mt-2 min-h-10 text-sm leading-relaxed text-slate-500">
				{form.description.trim() || "প্যাকেজের বিবরণ এখানে দেখা যাবে।"}
			</p>

			<div className="mt-5 flex items-baseline gap-2">
				<span className="text-4xl font-extrabold tracking-tight text-slate-900">
					{form.price ? `৳${formatBn(form.price)}` : "৳০"}
				</span>
				<span className="text-sm font-semibold text-slate-400">/ মাস</span>
			</div>
			{form.yearly_price ? (
				<p className="mt-1 text-sm font-semibold text-slate-500">
					বার্ষিক: ৳{formatBn(form.yearly_price)} / বছর
				</p>
			) : null}

			<div className="my-6 h-px bg-slate-100" />
			<ul className="space-y-2.5">
				{features.length > 0 ? (
					features.map((feature) => (
						<li
							key={feature.id}
							className="flex items-start gap-2.5 text-sm font-medium text-slate-600"
						>
							<Check
								className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
								aria-hidden="true"
							/>
							{feature.text}
						</li>
					))
				) : (
					<li className="text-sm font-medium text-slate-400">
						ফিচার যোগ করলে এখানে দেখা যাবে।
					</li>
				)}
			</ul>

			<div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
				<div className="rounded-xl bg-secondary/5 p-3.5">
					<Clock className="h-4 w-4 text-secondary" aria-hidden="true" />
					<p className="mt-1.5 text-xs font-medium text-slate-500">মেয়াদ</p>
					<p className="text-sm font-extrabold text-secondary-dark">
						{form.duration_in_days
							? `${formatBn(form.duration_in_days)} দিন`
							: "—"}
					</p>
				</div>
				<div className="rounded-xl bg-secondary/5 p-3.5">
					<Gauge className="h-4 w-4 text-secondary" aria-hidden="true" />
					<p className="mt-1.5 text-xs font-medium text-slate-500">API কল</p>
					<p className="text-sm font-extrabold text-secondary-dark">
						{form.api_call_limit ? formatBn(form.api_call_limit) : "০"}
					</p>
				</div>
			</div>
		</div>
	);
}

function RouteComponent() {
	const [form, setForm] = useState(emptyForm);
	const [features, setFeatures] = useState([]);
	const [featureDraft, setFeatureDraft] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const clearMessages = () => {
		setError("");
		setSuccess("");
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setForm((current) => ({
			...current,
			[name]: NUMERIC_FIELDS.has(name) ? value.replace(/\D/g, "") : value,
		}));
		clearMessages();
	};

	const addFeature = () => {
		const feature = featureDraft.trim();
		if (!feature) return;
		setFeatures((current) => [
			...current,
			{ id: crypto.randomUUID(), text: feature },
		]);
		setFeatureDraft("");
	};

	const handleFeatureKeyDown = (event) => {
		if (event.key !== "Enter") return;
		event.preventDefault();
		addFeature();
	};

	const removeFeature = (id) => {
		setFeatures((current) => current.filter((item) => item.id !== id));
	};

	const resetForm = () => {
		setForm(emptyForm());
		setFeatures([]);
		setFeatureDraft("");
		clearMessages();
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		clearMessages();

		const {
			name,
			description,
			price,
			yearly_price,
			duration_in_days,
			api_call_limit,
			is_active,
		} = form;
		const trimmedName = name.trim();
		const trimmedDescription = description.trim();

		if (!trimmedName) {
			setError("প্যাকেজের নাম লিখুন।");
			return;
		}
		if (!trimmedDescription) {
			setError("প্যাকেজের বিবরণ লিখুন।");
			return;
		}
		if (price === "") {
			setError("মাসিক মূল্য লিখুন।");
			return;
		}
		if (yearly_price === "") {
			setError("বার্ষিক মূল্য লিখুন।");
			return;
		}
		if (!duration_in_days || Number(duration_in_days) < 1) {
			setError("প্যাকেজের মেয়াদ কমপক্ষে ১ দিন হতে হবে।");
			return;
		}
		if (api_call_limit === "") {
			setError("API কল লিমিট লিখুন।");
			return;
		}

		setIsSubmitting(true);
		try {
			await createPackage({
				data: {
					name: trimmedName,
					description: trimmedDescription,
					price: Number(price),
					yearly_price: Number(yearly_price),
					duration_in_days: Number(duration_in_days),
					api_call_limit: Number(api_call_limit),
					features: features.map((feature) => feature.text),
					is_active,
				},
			});
			setSuccess("প্যাকেজ সফলভাবে তৈরি হয়েছে। চাইলে আরেকটি প্যাকেজ যোগ করুন।");
			setForm(emptyForm());
			setFeatures([]);
			setFeatureDraft("");
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "প্যাকেজ তৈরি করা যায়নি। পরে আবার চেষ্টা করুন।",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
			<div className="mx-auto max-w-6xl">
				<header className="mb-8">
					<div className="flex items-center gap-4">
						<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-secondary-dark text-white shadow-lg shadow-secondary/25">
							<Gem className="h-7 w-7" aria-hidden="true" />
						</span>
						<div>
							<h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
								নতুন প্যাকেজ তৈরি করুন
							</h1>
							<p className="mt-1 text-sm font-medium text-slate-500">
								সাবস্ক্রিপশন প্যাকেজের সব তথ্য দিন — ডান পাশের প্রিভিউ লাইভ আপডেট হয়।
							</p>
						</div>
					</div>
				</header>

				<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
					<div className="overflow-hidden rounded-3xl border border-secondary/10 bg-white shadow-xl shadow-secondary/10">
						<form
							className="space-y-8 p-6 sm:p-8"
							onSubmit={handleSubmit}
							noValidate
						>
							<section>
								<SectionTitle
									icon={FileText}
									title="মৌলিক তথ্য"
									description="প্যাকেজের নাম ও বিবরণ দিন।"
								/>
								<div className="space-y-5">
									<Field label="প্যাকেজের নাম" htmlFor="package-name">
										<input
											id="package-name"
											name="name"
											type="text"
											maxLength={100}
											value={form.name}
											onChange={handleChange}
											placeholder="যেমন: গ্রো"
											className={inputClass}
										/>
									</Field>
									<Field
										label="বিবরণ"
										htmlFor="package-description"
										hint={`${form.description.length}/২০০০`}
									>
										<textarea
											id="package-description"
											name="description"
											maxLength={2000}
											value={form.description}
											onChange={handleChange}
											placeholder="প্যাকেজে কী কী থাকছে তার সংক্ষিপ্ত বিবরণ লিখুন।"
											rows={4}
											className={cn(
												inputClass,
												"h-auto min-h-32 resize-none py-4 leading-relaxed",
											)}
										/>
									</Field>
								</div>
							</section>

							<section className="border-t border-secondary/10 pt-8">
								<SectionTitle
									icon={CircleDollarSign}
									title="মূল্য নির্ধারণ"
									description="মাসিক ও বার্ষিক মূল্য, এবং প্যাকেজের মেয়াদ দিন।"
								/>
								<div className="grid gap-5 sm:grid-cols-2">
									<Field label="মাসিক মূল্য" htmlFor="package-price">
										<PriceInput
											id="package-price"
											name="price"
											value={form.price}
											onChange={handleChange}
											placeholder="০"
										/>
									</Field>
									<Field label="বার্ষিক মূল্য" htmlFor="package-yearly-price">
										<PriceInput
											id="package-yearly-price"
											name="yearly_price"
											value={form.yearly_price}
											onChange={handleChange}
											placeholder="০"
										/>
									</Field>
									<Field label="মেয়াদ (দিন)" htmlFor="package-duration">
										<input
											id="package-duration"
											name="duration_in_days"
											type="text"
											inputMode="numeric"
											value={form.duration_in_days}
											onChange={handleChange}
											placeholder="যেমন: 30"
											className={inputClass}
										/>
									</Field>
									<Field label="API কল লিমিট" htmlFor="package-api-limit">
										<input
											id="package-api-limit"
											name="api_call_limit"
											type="text"
											inputMode="numeric"
											value={form.api_call_limit}
											onChange={handleChange}
											placeholder="যেমন: 500"
											className={inputClass}
										/>
									</Field>
								</div>
							</section>

							<section className="border-t border-secondary/10 pt-8">
								<SectionTitle
									icon={ListChecks}
									title="প্যাকেজ ফিচার"
									description="সুবিধাগুলো একে একে যোগ করুন।"
								/>
								<div className="flex gap-3">
									<input
										value={featureDraft}
										maxLength={200}
										onChange={(event) => setFeatureDraft(event.target.value)}
										onKeyDown={handleFeatureKeyDown}
										placeholder="যেমন: মাসে ৫০০টি সার্চ"
										className={cn(inputClass, "min-w-0 flex-1")}
										aria-label="নতুন ফিচার"
									/>
									<button
										type="button"
										onClick={addFeature}
										disabled={!featureDraft.trim() || features.length >= 50}
										className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary text-white shadow-lg shadow-secondary/20 transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/25 disabled:cursor-not-allowed disabled:opacity-40"
										aria-label="ফিচার যোগ করুন"
									>
										<Plus className="h-5 w-5" aria-hidden="true" />
									</button>
								</div>{" "}
								{features.length >= 50 ? (
									<p className="mt-3 text-xs font-medium text-slate-400">
										সর্বোচ্চ ৫০টি ফিচার যোগ করা যাবে।
									</p>
								) : null}
								{features.length > 0 ? (
									<ul className="mt-4 flex flex-wrap gap-2">
										{" "}
										{features.map((feature) => (
											<li
												key={feature.id}
												className="inline-flex items-center gap-2 rounded-full border border-secondary/15 bg-secondary/5 py-1.5 pl-3.5 pr-1.5 text-sm font-semibold text-secondary-dark"
											>
												<Check
													className="h-3.5 w-3.5 text-secondary"
													aria-hidden="true"
												/>
												<span className="max-w-56 truncate">
													{feature.text}
												</span>
												<button
													type="button"
													onClick={() => removeFeature(feature.id)}
													className="rounded-full p-1 text-slate-400 transition hover:bg-rose-100 hover:text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-200"
													aria-label={`"${feature.text}" ফিচারটি মুছুন`}
												>
													<X className="h-3.5 w-3.5" aria-hidden="true" />
												</button>
											</li>
										))}
									</ul>
								) : (
									<p className="mt-3 text-xs font-medium text-slate-400">
										কোনো ফিচার যোগ না করলেও প্যাকেজ তৈরি করা যাবে।
									</p>
								)}
							</section>

							<section className="border-t border-secondary/10 pt-8">
								<SectionTitle
									icon={Power}
									title="স্ট্যাটাস"
									description="প্যাকেজটি এখনই সক্রিয় থাকবে নাকি নিষ্ক্রিয় থাকবে।"
								/>
								<Toggle
									checked={form.is_active}
									onChange={(checked) => {
										setForm((current) => ({ ...current, is_active: checked }));
										clearMessages();
									}}
									label="প্যাকেজ সক্রিয় করুন"
									description="সক্রিয় প্যাকেজ ইউজারদের কাছে দেখানো হবে।"
								/>
							</section>

							{error ? (
								<p
									className="flex items-start gap-2.5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700"
									role="alert"
								>
									<CircleAlert
										className="mt-0.5 h-5 w-5 shrink-0"
										aria-hidden="true"
									/>
									{error}
								</p>
							) : null}

							{success ? (
								// biome-ignore lint/a11y/useSemanticElements: role=status is the correct live-region pattern; output is for computation results
								<p
									role="status"
									className="flex items-start gap-2.5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"
								>
									<BadgeCheck
										className="mt-0.5 h-5 w-5 shrink-0"
										aria-hidden="true"
									/>
									{success}
								</p>
							) : null}

							<div className="flex flex-col-reverse gap-3 border-t border-secondary/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
								<button
									type="button"
									onClick={resetForm}
									className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border-2 border-secondary/20 px-6 text-sm font-bold text-secondary transition hover:bg-secondary/10 focus:outline-none focus:ring-4 focus:ring-secondary/15"
								>
									ফর্ম রিসেট করুন
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-secondary px-8 text-sm font-extrabold text-white shadow-lg shadow-secondary/25 transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/25 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{isSubmitting ? (
										<>
											<LoaderCircle
												className="h-5 w-5 animate-spin"
												aria-hidden="true"
											/>
											তৈরি হচ্ছে...
										</>
									) : (
										<>
											<PackagePlus className="h-5 w-5" aria-hidden="true" />
											প্যাকেজ তৈরি করুন
										</>
									)}
								</button>
							</div>
						</form>
					</div>

					<aside className="lg:sticky lg:top-6">
						<LivePreview form={form} features={features} />
						<p className="mt-4 flex items-start gap-2.5 rounded-2xl border border-secondary/10 bg-secondary/5 px-4 py-3.5 text-xs font-medium leading-relaxed text-secondary-dark">
							<Sparkles
								className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
								aria-hidden="true"
							/>{" "}
							আপনি টাইপ করার সাথে সাথে এই প্রিভিউ আপডেট হয় — সেভ করার আগে দেখে নিন।
						</p>
					</aside>
				</div>
			</div>
		</main>
	);
}
