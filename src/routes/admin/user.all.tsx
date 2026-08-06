// @ts-nocheck
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import UserModal, {
	type UserFormData,
} from "@/components/admin/user/userModal";
import { UserTable } from "@/components/admin/userTable";
import { useAuth } from "@/context/userContext";
import {
	createAdminUser,
	deleteUserById,
	getUsers,
	updateAdminUser,
} from "@/server/functions/user.fn";

const usersQuery = queryOptions({
	queryKey: ["users"],
	queryFn: async () => getUsers(),
});

export const Route = createFileRoute("/admin/user/all")({
	loader: ({ context }) => context.queryClient.ensureQueryData(usersQuery),
	component: AdminAllPage,
});

function AdminAllPage() {
	const { user } = useAuth();
	const queryClient = useQueryClient();
	const createUserFn = useServerFn(createAdminUser);
	const updateUserFn = useServerFn(updateAdminUser);
	const deleteUserFn = useServerFn(deleteUserById);
	const { data: users = [] } = useQuery(usersQuery);
	const [searchTerm, setSearchTerm] = useState("");
	const [isUserModalOpen, setIsUserModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [isSubmittingUser, setIsSubmittingUser] = useState(false);
	const [userModalError, setUserModalError] = useState("");

	const query = searchTerm.trim().toLowerCase();
	const filteredUsers = query
		? users.filter((item) =>
				[item.name, item.number, item.role].some((value) =>
					String(value ?? "")
						.toLowerCase()
						.includes(query),
				),
			)
		: users;

	const closeUserModal = () => {
		setIsUserModalOpen(false);
		setSelectedUser(null);
		setUserModalError("");
	};

	const handleUserSubmit = async (data: UserFormData) => {
		setIsSubmittingUser(true);
		setUserModalError("");

		try {
			if (selectedUser) {
				const updatedUser = await updateUserFn({
					data: {
						id: selectedUser._id,
						name: data.name,
						number: data.number,
						...(data.password ? { password: data.password } : {}),
					},
				});
				queryClient.setQueryData(usersQuery.queryKey, (currentUsers = []) =>
					currentUsers.map((currentUser) =>
						currentUser._id === updatedUser._id ? updatedUser : currentUser,
					),
				);
			} else {
				const createdUser = await createUserFn({ data });
				queryClient.setQueryData(usersQuery.queryKey, (currentUsers = []) => [
					createdUser,
					...currentUsers,
				]);
			}
			closeUserModal();
		} catch (error) {
			setUserModalError(
				error instanceof Error
					? error.message
					: "Failed to save user. Please try again.",
			);
		} finally {
			setIsSubmittingUser(false);
		}
	};

	const handleEdit = (id) => {
		const userToEdit = users.find((item) => item._id === id);
		if (!userToEdit) return;

		setUserModalError("");
		setSelectedUser(userToEdit);
		setIsUserModalOpen(true);
	};

	const handleDelete = async (id) => {
		await deleteUserFn({ data: { id } });
		queryClient.setQueryData(usersQuery.queryKey, (currentUsers = []) =>
			currentUsers.filter((currentUser) => currentUser._id !== id),
		);
		// The user's subscriptions were deleted on the server too — drop
		// the stale copy so All Subscriptions can never show them again.
		queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
	};

	return (
		<main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div className="flex items-center justify-between sm:contents">
						<h1 className="mt-1 text-3xl font-extrabold tracking-tight text-secondary-dark">
							All users
						</h1>
						<button
							type="button"
							onClick={() => {
								setUserModalError("");
								setSelectedUser(null);
								setIsUserModalOpen(true);
							}}
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3 text-sm font-bold text-white transition hover:bg-secondary-dark focus:outline-none focus:ring-4 focus:ring-secondary/20 sm:order-3"
						>
							<Plus className="size-4" />
							Add user
						</button>
					</div>

					<div className="relative w-full sm:order-2 sm:w-64">
						<Search
							aria-hidden="true"
							className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
						/>
						<input
							aria-label="Search users"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Search users..."
							className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
						/>
					</div>
				</div>

				<UserTable
					data={filteredUsers}
					searchTerm={searchTerm}
					canDelete={user?.role === "super_admin"}
					onDeleteItem={handleDelete}
					onEditItem={handleEdit}
				/>
			</div>

			{isUserModalOpen && (
				<UserModal
					onCancel={closeUserModal}
					onSubmit={handleUserSubmit}
					user={selectedUser}
					isSubmitting={isSubmittingUser}
					error={userModalError}
				/>
			)}
		</main>
	);
}
