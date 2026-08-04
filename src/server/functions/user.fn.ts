// @ts-nocheck
import { createServerFn } from "@tanstack/react-start";
import { requireRole } from "@/server/middleware";
import { User } from "@/server/models/user.model";

export const getUsers = createServerFn({ method: "GET" })
	.middleware([requireRole(["admin", "super_admin"])])
	.handler(async () => {
		const users = await User.find()
			.select("name number isActive role createdAt updatedAt")
			.lean();

		return JSON.parse(JSON.stringify(users));
	});
export const deleteUserById = createServerFn({ method: "DELETE" })
	.middleware([requireRole("super_admin")])
	.handler(async ({ id }) => {
		const user = await User.findByIdAndDelete(id);

		if (!user) {
			throw new Error("User not found");
		}

		return JSON.parse(JSON.stringify(user));
	});
