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
