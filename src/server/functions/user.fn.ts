// @ts-nocheck
import { createServerFn } from "@tanstack/react-start";
import { User } from "@/server/models/user.model";
import { requireRole } from "@/server/middleware";

export const getUsers = createServerFn({ method: "GET" })
	.middleware([requireRole("admin")])
	.handler(async () => {
		const users = await User.find()
			.select("name number isActive role createdAt updatedAt")
			.lean();

		return JSON.parse(JSON.stringify(users));
	});
