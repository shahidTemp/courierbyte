// @ts-nocheck
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { PackagePlus, Search } from "lucide-react";
import { useState } from "react";
import PackageModal, {
	type PackageFormData,
} from "@/components/admin/packageModal";
import PackageTable from "@/components/admin/packageTable";
import {
	createPackage,
	getPackages,
	updatePackage,
} from "@/server/functions/package.fn";

const packagesQuery = queryOptions({
	queryKey: ["packages"],
	queryFn: () => getPackages(),
});

export const Route = createFileRoute("/admin/package/all")({
	loader: ({ context }) => context.queryClient.ensureQueryData(packagesQuery),
	component: PackagesPage,
});

function PackagesPage() {
	const queryClient = useQueryClient();
	const { data: packages = [] } = useQuery(packagesQuery);
	const createPackageFn = useServerFn(createPackage);
	const updatePackageFn = useServerFn(updatePackage);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedPackage, setSelectedPackage] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const query = searchTerm.trim().toLowerCase();
	const filteredPackages = query
		? packages.filter((item) =>
				[item.name, item.description, ...(item.features ?? [])].some((value) =>
					String(value ?? "")
						.toLowerCase()
						.includes(query),
				),
			)
		: packages;
	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedPackage(null);
		setError("");
	};
	const openCreate = () => {
		setSelectedPackage(null);
		setError("");
		setIsModalOpen(true);
	};
	const openEdit = (id) => {
		const item = packages.find((packageItem) => packageItem._id === id);
		if (!item) return;
		setSelectedPackage(item);
		setError("");
		setIsModalOpen(true);
	};
	const submit = async (data: PackageFormData) => {
		setIsSubmitting(true);
		setError("");
		const payload = {
			name: data.name.trim(),
			description: data.description.trim(),
			price: Number(data.price),
			yearly_price: Number(data.yearly_price),
			duration_in_days: Number(data.duration_in_days),
			api_call_limit: Number(data.api_call_limit),
			features: data.features.map((feature) => feature.trim()),
			is_active: data.is_active,
		};
		try {
			const savedPackage = selectedPackage
				? await updatePackageFn({
						data: { id: selectedPackage._id, ...payload },
					})
				: await createPackageFn({ data: payload });
			queryClient.setQueryData(packagesQuery.queryKey, (current = []) =>
				selectedPackage
					? current.map((item) =>
							item._id === savedPackage._id ? savedPackage : item,
						)
					: [savedPackage, ...current],
			);
			closeModal();
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "Failed to save package. Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="flex items-center justify-between lg:contents">
						<h1 className="text-3xl font-extrabold tracking-tight text-secondary-dark">
							Packages
						</h1>
						<button
							type="button"
							onClick={openCreate}
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-secondary/20 transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/20 lg:order-3"
						>
							<PackagePlus className="size-4" /> Add package
						</button>
					</div>
					<div className="relative w-full lg:order-2 lg:w-64">
						<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
						<input
							aria-label="Search packages"
							className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
							placeholder="Search packages..."
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
						/>
					</div>
				</div>
				<PackageTable
					data={filteredPackages}
					onEditItem={openEdit}
					searchTerm={searchTerm}
				/>
			</div>
			{isModalOpen && (
				<PackageModal
					packageItem={selectedPackage}
					onCancel={closeModal}
					onSubmit={submit}
					isSubmitting={isSubmitting}
					error={error}
				/>
			)}
		</main>
	);
}
