import crypto from "node:crypto";
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

const createAdminUserSchema = z.object({
	name: z.string().trim().min(1),
	number: z.string().trim().min(1),
	password: z.string().min(6),
});

export const createAdminUser = createServerFn({ method: "POST" })
	.middleware([requireRole(["admin", "super_admin"])])
	.validator(createAdminUserSchema)
	.handler(async ({ data }) => {
		const existingUser = await User.findOne({ number: data.number });
		if (existingUser) {
			throw new Error("A user with this number already exists");
		}

		const user = await User.create({
			name: data.name,
			number: data.number,
			password: data.password,
			apiKey: crypto.randomBytes(32).toString("hex"),
		});

		const {
			password: _password,
			apiKey: _apiKey,
			...safeUser
		} = user.toObject();
		return JSON.parse(JSON.stringify(safeUser));
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
