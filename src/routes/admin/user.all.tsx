import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { type UserRow, UserTable } from "@/components/admin/userTable";
import { useAuth } from "@/context/userContext";
import { deleteUserById, getUsers } from "@/server/functions/user.fn";

const usersQuery = queryOptions({
	queryKey: ["users"],
	queryFn: async (): Promise<UserRow[]> => getUsers(),
});

export const Route = createFileRoute("/admin/user/all")({
	loader: ({ context }) => context.queryClient.ensureQueryData(usersQuery),
	component: AdminAllPage,
});

function AdminAllPage() {
	const { user } = useAuth() as {
		user: { role?: string } | null;
	};
	const queryClient = useQueryClient();
	const deleteUserFn = useServerFn(deleteUserById);
	const { data: users = [] } = useQuery(usersQuery);
	const [searchTerm, setSearchTerm] = useState("");

	const filteredUsers = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) return users;

		return users.filter((item) =>
			[item.name, item.number, item.role].some((value) =>
				String(value ?? "")
					.toLowerCase()
					.includes(query),
			),
		);
	}, [searchTerm, users]);

	const handleDelete = async (id: string) => {
		await deleteUserFn({ data: { id } });
		queryClient.setQueryData<UserRow[]>(
			usersQuery.queryKey,
			(currentUsers = []) =>
				currentUsers.filter((currentUser) => currentUser._id !== id),
		);
	};

	return (
		<main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-7xl">
				<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<h1 className="mt-1 text-3xl font-extrabold tracking-tight text-secondary-dark">
						All users
					</h1>

					<div className="relative w-full sm:max-w-xs">
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
					onEditItem={() => undefined}
				/>
			</div>
		</main>
	);
}
