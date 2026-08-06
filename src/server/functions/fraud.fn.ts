import { createServerFn } from "@tanstack/react-start";
import { executeFraudCheck, phoneSchema } from "@/server/lib/fraud";
import { authMiddleware } from "@/server/middleware";

/** Run a fraud check for the currently authenticated panel user. */
export const checkFraud = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(phoneSchema)
	.handler(async ({ data, context }) => {
		const result = await executeFraudCheck(
			String(context.actor._id),
			data.phone,
		);
		// Arbitrary JSON from the courier provider — round-trip to satisfy the
		// server function serializer (same pattern as the other *.fn.ts files).
		return JSON.parse(JSON.stringify(result));
	});
