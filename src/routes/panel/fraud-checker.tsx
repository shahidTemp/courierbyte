// @ts-nocheck
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
	phone: z.string().optional(),
});

export const Route = createFileRoute("/panel/fraud-checker")({
	validateSearch: searchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { phone } = Route.useSearch();

	return <div>{phone}</div>;
}
