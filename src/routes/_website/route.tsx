// @ts-nocheck
import { createFileRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";

export const Route = createFileRoute("/_website")({
	component: WebsiteLayout,
});

function WebsiteLayout() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-1">
				<Outlet />
			</main>
			<Footer />
		</div>
	);
}
