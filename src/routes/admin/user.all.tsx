import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/user/all")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/admin/user/all"!</div>;
}
