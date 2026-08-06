// @ts-nocheck
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import KeyModal, { type KeyFormData } from "@/components/admin/keyModal";
import { KeysTable } from "@/components/admin/keysTable";
import { useAuth } from "@/context/userContext";
import {
	createKey,
	deleteKey,
	getKeys,
	updateKey,
	updateKeyStatus,
} from "@/server/functions/keys.fn";

const keysQuery = queryOptions({
	queryKey: ["keys"],
	queryFn: () => getKeys(),
});

export const Route = createFileRoute("/admin/keys/all")({
	component: KeysPage,
});

function KeysPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const { data: keys = [] } = useQuery({
		...keysQuery,
		enabled: user?.role === "super_admin",
	});
	const createKeyFn = useServerFn(createKey);
	const updateKeyFn = useServerFn(updateKey);
	const updateStatusFn = useServerFn(updateKeyStatus);
	const deleteKeyFn = useServerFn(deleteKey);
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedKey, setSelectedKey] = useState(null);
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
						Only the super admin can manage courier API keys.
					</p>
				</div>
			</main>
		);
	}

	const query = searchTerm.trim().toLowerCase();
	const filteredKeys = query
		? keys.filter((item) =>
				[item.keyValue, item.status, String(item.dailyLimit)].some((value) =>
					String(value ?? "")
						.toLowerCase()
						.includes(query),
				),
			)
		: keys;

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedKey(null);
		setError("");
	};

	const openCreate = () => {
		setSelectedKey(null);
		setError("");
		setIsModalOpen(true);
	};

	const openEdit = (id) => {
		const item = keys.find((key) => key._id === id);
		if (!item) return;
		setSelectedKey(item);
		setError("");
		setIsModalOpen(true);
	};

	const submit = async (data: KeyFormData) => {
		setIsSubmitting(true);
		setError("");
		const keyValue = data.keyValue.trim();
		try {
			const savedKey = selectedKey
				? await updateKeyFn({
						data: {
							id: selectedKey._id,
							dailyLimit: Number(data.dailyLimit),
							...(keyValue ? { keyValue } : {}),
						},
					})
				: await createKeyFn({
						data: { keyValue, dailyLimit: Number(data.dailyLimit) },
					});
			queryClient.setQueryData(keysQuery.queryKey, (current = []) =>
				selectedKey
					? current.map((item) => (item._id === savedKey._id ? savedKey : item))
					: [savedKey, ...current],
			);
			closeModal();
		} catch (submitError) {
			setError(
				submitError instanceof Error
					? submitError.message
					: "Failed to save key. Please try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleStatusChange = async (id, status) => {
		const updated = await updateStatusFn({ data: { id, status } });
		queryClient.setQueryData(keysQuery.queryKey, (current = []) =>
			current.map((item) => (item._id === updated._id ? updated : item)),
		);
	};

	const handleDelete = async (id) => {
		await deleteKeyFn({ data: { id } });
		queryClient.setQueryData(keysQuery.queryKey, (current = []) =>
			current.filter((item) => item._id !== id),
		);
	};

	return (
		<main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="flex items-center justify-between lg:contents">
						<h1 className="text-3xl font-extrabold tracking-tight text-secondary-dark">
							All keys
						</h1>
						<button
							type="button"
							onClick={openCreate}
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-secondary/20 transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/20 lg:order-3"
						>
							<Plus className="size-4" /> Add key
						</button>
					</div>
					<div className="relative w-full lg:order-2 lg:w-64">
						<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
						<input
							aria-label="Search keys"
							className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
							placeholder="Search keys..."
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
						/>
					</div>
				</div>

				<KeysTable
					data={filteredKeys}
					searchTerm={searchTerm}
					onStatusChange={handleStatusChange}
					onEditItem={openEdit}
					onDeleteItem={handleDelete}
				/>
			</div>

			{isModalOpen && (
				<KeyModal
					keyItem={selectedKey}
					onCancel={closeModal}
					onSubmit={submit}
					isSubmitting={isSubmitting}
					error={error}
				/>
			)}
		</main>
	);
}
