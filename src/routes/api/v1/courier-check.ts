import { createFileRoute } from "@tanstack/react-router";
import { executeFraudCheck, FraudError, phoneSchema } from "@/server/lib/fraud";
import { User } from "@/server/models/user.model";

const json = (body: unknown, status = 200) =>
	Response.json(body, {
		status,
		headers: {
			"Cache-Control": "no-store",
		},
	});

export const Route = createFileRoute("/api/v1/courier-check")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const authorization = request.headers.get("authorization");
				const apiKey =
					authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim() ?? "";

				if (!apiKey) {
					return json(
						{ success: false, error: "A Bearer API key is required" },
						401,
					);
				}

				const user = await User.findOne({
					apiKey,
					isActive: true,
				}).select("+apiKey _id");

				if (!user) {
					return json(
						{ success: false, error: "Invalid or inactive API key" },
						401,
					);
				}

				let body: unknown;
				try {
					body = await request.json();
				} catch {
					return json(
						{ success: false, error: "Request body must be valid JSON" },
						400,
					);
				}

				const parsed = phoneSchema.safeParse(body);
				if (!parsed.success) {
					return json(
						{
							success: false,
							error: parsed.error.issues[0]?.message ?? "Invalid phone number",
						},
						400,
					);
				}

				try {
					const result = await executeFraudCheck(
						String(user._id),
						parsed.data.phone,
					);
					return json({ success: true, data: result });
				} catch (error) {
					if (error instanceof FraudError) {
						return json({ success: false, error: error.message }, error.status);
					}

					return json(
						{
							success: false,
							error: "Courier service is temporarily unavailable",
						},
						503,
					);
				}
			},
		},
	},
});
