import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { checkCourier } from "@/server/functions/service.fn";
import { userSubscription } from "@/server/models/subscription.model";
import { User } from "@/server/models/user.model";

const phoneSchema = z.object({
	phone: z
		.string()
		.regex(/^01[3-9]\d{8}$/, "A valid 11-digit phone number is required"),
});

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
				}).select("+apiKey");

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

				const activeSubscription = await userSubscription
					.findOne({
						userId: user._id,
						status: "active",
						end_date: { $gt: new Date() },
					})
					.lean();

				if (!activeSubscription) {
					return json(
						{ success: false, error: "No active subscription was found" },
						403,
					);
				}

				const reservedSubscription = await userSubscription
					.findOneAndUpdate(
						{
							_id: activeSubscription._id,
							$expr: {
								$lt: ["$api_calls_used", "$packageSnapshot.api_call_limit"],
							},
						},
						{ $inc: { api_calls_used: 1 } },
						{ new: true },
					)
					.lean();

				if (!reservedSubscription) {
					return json(
						{ success: false, error: "API call limit has been reached" },
						429,
					);
				}

				try {
					const result = await checkCourier(parsed.data.phone);
					return json({ success: true, data: result });
				} catch {
					await userSubscription.updateOne(
						{ _id: reservedSubscription._id, api_calls_used: { $gt: 0 } },
						{ $inc: { api_calls_used: -1 } },
					);
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
