import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/user/sidebar";

export const Route = createFileRoute("/panel")({
	component: UserLayout,
});

function UserLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			<Sidebar />
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	);
}
