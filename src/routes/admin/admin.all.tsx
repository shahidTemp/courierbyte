// @ts-nocheck
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import AdminModal, { type AdminFormData } from "@/components/admin/adminModal";
import AdminTable from "@/components/admin/adminTable";
import { useAuth } from "@/context/userContext";
import {
	createAdmin,
	deleteAdminById,
	getAdmins,
	updateAdmin,
} from "@/server/functions/admin.fn";

const adminsQuery = queryOptions({
	queryKey: ["admins"],
	queryFn: () => getAdmins(),
});

export const Route = createFileRoute("/admin/admin/all")({
	component: AdminsPage,
});

function AdminsPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { data: admins = [] } = useQuery({
		...adminsQuery,
		enabled: user?.role === "super_admin",
	});
	const createAdminFn = useServerFn(createAdmin);
	const updateAdminFn = useServerFn(updateAdmin);
	const deleteAdminFn = useServerFn(deleteAdminById);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedAdmin, setSelectedAdmin] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	if (user?.role !== "super_admin") {
		return (
			<main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
				<div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
					<ShieldCheck className="mx-auto mb-4 size-12 text-amber-600" />
					<h1 className="text-2xl font-extrabold text-amber-950">
						Super admin access required
					</h1>
					<p className="mt-2 text-amber-800">
						Only the super admin can manage administrator accounts.
					</p>
				</div>
			</main>
		);
	}

	const query = searchTerm.trim().toLowerCase();
	const filteredAdmins = query
		? admins.filter((admin) =>
				[admin.name, admin.number].some((value) =>
					String(value ?? "")
						.toLowerCase()
						.includes(query),
				),
			)
		: admins;
	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedAdmin(null);
		setError("");
	};
	const openCreate = () => {
		setSelectedAdmin(null);
		setError("");
		setIsModalOpen(true);
	};
	const openEdit = (id) => {
		const admin = admins.find((item) => item._id === id);
		if (!admin) return;
		setSelectedAdmin(admin);
		setError("");
		setIsModalOpen(true);
	};
	const handleDelete = async (id) => {
		await deleteAdminFn({ data: { id } });
		queryClient.setQueryData(adminsQuery.queryKey, (current = []) =>
			current.filter((admin) => admin._id !== id),
		);
	};
	const submit = async (data: AdminFormData) => {
		setIsSubmitting(true);
		setError("");
		try {
			const savedAdmin = selectedAdmin
				? await updateAdminFn({
						data: {
							id: selectedAdmin._id,
							name: data.name,
							number: data.number,
							...(data.password ? { password: data.password } : {}),
						},
					})
				: await createAdminFn({ data });
			queryClient.setQueryData(adminsQuery.queryKey, (current = []) =>
				selectedAdmin
					? current.map((item) =>
							item._id === savedAdmin._id ? savedAdmin : item,
						)
					: [savedAdmin, ...current],
			);
			closeModal();
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "Failed to save administrator. Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-secondary/60">
							Access control
						</p>
						<h1 className="text-3xl font-extrabold tracking-tight text-secondary-dark">
							Administrators
						</h1>
						<p className="mt-1 text-sm text-slate-500">
							Create and maintain the people who can operate the dashboard.
						</p>
					</div>
					<div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
						<div className="relative min-w-0 flex-1 sm:w-64">
							<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
							<input
								aria-label="Search administrators"
								className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
								placeholder="Search admins..."
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
							/>
						</div>
						<button
							type="button"
							onClick={openCreate}
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-secondary/20 transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/20"
						>
							<Plus className="size-4" /> Add admin
						</button>
					</div>
				</div>
				<AdminTable
					data={filteredAdmins}
					onDeleteItem={handleDelete}
					onEditItem={openEdit}
					searchTerm={searchTerm}
				/>
			</div>
			{isModalOpen && (
				<AdminModal
					admin={selectedAdmin}
					onCancel={closeModal}
					onSubmit={submit}
					isSubmitting={isSubmitting}
					error={error}
				/>
			)}
		</main>
	);
}
