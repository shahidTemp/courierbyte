import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/server/middleware";
import { User } from "@/server/models/user.model";

export const getUsers = createServerFn({ method: "GET" })
	.middleware([requireRole(["admin", "super_admin"])])
	.handler(async () => {
		const users = await User.find({ role: "user" })
			.select("name number isActive role createdAt updatedAt")
			.lean();

		return JSON.parse(JSON.stringify(users));
	});

const deleteUserSchema = z.object({
	id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID"),
});

export const deleteUserById = createServerFn({ method: "POST" })
	.middleware([requireRole("super_admin")])
	.validator(deleteUserSchema)
	.handler(async ({ data }) => {
		const deletedUser = await User.findByIdAndDelete(data.id);

		if (!deletedUser) {
			throw new Error("User not found");
		}

		return { success: true, id: data.id };
	});
