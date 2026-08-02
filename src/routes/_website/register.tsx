import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_website/register")({
	component: Register,
});

function Register() {
	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Register</h1>
			<p className="mt-4 text-lg">Register page coming soon.</p>
		</div>
	);
}
