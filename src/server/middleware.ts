import { createMiddleware } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { User } from "@/server/models/user.model";
import type { Role } from "@/server/rbac";
import { useAppSession } from "@/utils/session";

function reject(
	status: 401 | 403,
	message: "Unauthorized" | "Forbidden",
): never {
	setResponseStatus(status);
	throw new Error(message);
}

export const authMiddleware = createMiddleware({ type: "function" }).server(
	async ({ next }) => {
		const session = await useAppSession();
		const userId = session.data.userId;

		if (!userId) {
			reject(401, "Unauthorized");
		}

		const actor = await User.findById(userId).lean();

		if (!actor || !actor.isActive) {
			reject(401, "Unauthorized");
		}

		return next({
			context: {
				actor,
			},
		});
	},
);

// export function requireRole(requiredRole: Role) {
// 	return createMiddleware({ type: "function" })
// 		.middleware([authMiddleware])
// 		.server(async ({ next, context }) => {
// 			if (!hasRequiredRole(context.actor.role, requiredRole)) {
// 				reject(403, "Forbidden");
// 			}

// 			return next();
// 		});
// }

export function requireRole(requiredRoles: Role | Role[]) {
	const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

	return createMiddleware({ type: "function" })
		.middleware([authMiddleware])
		.server(async ({ next, context }) => {
			if (!roles.includes(context.actor.role)) {
				reject(403, "Forbidden");
			}

			return next();
		});
}
