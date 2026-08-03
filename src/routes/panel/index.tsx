import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/userContext";

export const Route = createFileRoute("/panel/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { user, isLoading } = useAuth();

	return (
		<main className="p-6">
			<h1 className="mb-4 text-2xl font-bold">Current user</h1>
			<pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-white">
				{JSON.stringify(user, null, 2)}
			</pre>
		</main>
	);
}
