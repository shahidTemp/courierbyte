import crypto from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/server/middleware";
import { userSubscription } from "@/server/models/subscription.model";
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
	isActive: z.boolean(),
});

const updateAdminUserSchema = z.object({
	id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user ID"),
	name: z.string().trim().min(1),
	number: z.string().trim().min(1),
	password: z.string().min(6).optional(),
	isActive: z.boolean(),
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
			isActive: data.isActive,
		});

		const {
			password: _password,
			apiKey: _apiKey,
			...safeUser
		} = user.toObject();
		return JSON.parse(JSON.stringify(safeUser));
	});

export const updateAdminUser = createServerFn({ method: "POST" })
	.middleware([requireRole(["admin", "super_admin"])])
	.validator(updateAdminUserSchema)
	.handler(async ({ data }) => {
		const existingUser = await User.findOne({
			number: data.number,
			_id: { $ne: data.id },
		});
		if (existingUser) {
			throw new Error("A user with this number already exists");
		}

		const user = await User.findOne({ _id: data.id, role: "user" });
		if (!user) {
			throw new Error("User not found");
		}

		user.name = data.name;
		user.number = data.number;
		user.isActive = data.isActive;
		if (data.password !== undefined) user.password = data.password;

		try {
			await user.save();
		} catch (error) {
			if (
				error &&
				typeof error === "object" &&
				"code" in error &&
				error.code === 11000
			) {
				throw new Error("A user with this number already exists");
			}
			throw error;
		}

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
		const existingUser = await User.findById(data.id);
		if (!existingUser) {
			throw new Error("User not found");
		}

		// Cascade: remove the user's subscriptions first, so no orphan
		// documents with a dangling userId are ever left behind.
		await userSubscription.deleteMany({ userId: data.id });
		await User.findByIdAndDelete(data.id);

		return { success: true, id: data.id };
	});
