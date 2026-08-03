// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/panel/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	return <section></section>;
}
