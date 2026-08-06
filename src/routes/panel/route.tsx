// @ts-nocheck
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Loader } from "@/components/common/loader";
import { AccountInactive } from "@/components/user/accountInactive";
import { Sidebar } from "@/components/user/sidebar";
import { useAuth } from "@/context/userContext";

export const Route = createFileRoute("/panel")({
	component: UserLayout,
});

function UserLayout() {
	const { isLoading, isAuthenticated, user } = useAuth();

	if (isLoading) return <Loader />;

	if (!isAuthenticated) return <Navigate to="/login" />;
	if (user?.role !== "user") return <Navigate to="/admin" />;
	if (!user?.isActive) return <AccountInactive />;

	return (
		<div className="min-h-screen lg:flex">
			<Sidebar />
			<main className="min-w-0 flex-1">
				<Outlet />
			</main>
		</div>
	);
}
