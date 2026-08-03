// @ts-nocheck
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Loader } from "@/components/common/loader";
import { Sidebar } from "@/components/user/sidebar";
import { useAuth } from "@/context/userContext";
export const Route = createFileRoute("/panel")({
	component: UserLayout,
});

function UserLayout() {
	const { isLoading, isAuthenticated } = useAuth();
	const navigate = useNavigate();
	if (isLoading) return <Loader />;
	if (isAuthenticated) return navigate({ to: "/" });

	return (
		<div className="min-h-screen lg:flex">
			<Sidebar />
			<main className="min-w-0 flex-1">
				<Outlet />
			</main>
		</div>
	);
}
