import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/user/sidebar";

export const Route = createFileRoute("/panel")({
	component: UserLayout,
});

function UserLayout() {
	return (
		<div className="min-h-screen lg:flex">
			<Sidebar />
			<main className="min-w-0 flex-1">
				<Outlet />
			</main>
		</div>
	);
}
