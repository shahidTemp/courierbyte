// @ts-nocheck
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { Loader } from "@/components/common/loader";
import { Sidebar } from "@/components/admin/sidebar";
import { useAuth } from "@/context/userContext";

export const Route = createFileRoute("/admin")({
	component: AdminLayout,
});

function AdminLayout() {
	const { isLoading, isAuthenticated, user } = useAuth();

	if (isLoading) return <Loader />;

	if (!isAuthenticated) return <Navigate to="/login" />;
	if (
		(user?.role !== "admin" && user?.role !== "super_admin") ||
		!user?.isActive
	)
		return <Navigate to="/" />;

	return (
		<div className="min-h-screen lg:flex">
			<Sidebar />
			<main className="min-w-0 flex-1">
				<Outlet />
			</main>
		</div>
	);
}
