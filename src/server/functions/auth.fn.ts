// @ts-nocheck
import crypto from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { User } from "@/server/models/user.model";
import { authMiddleware } from "@/server/middleware";
import { useAppSession } from "@/utils/session";

const createUserSchema = z.object({
	name: z.string().trim().min(1),
	number: z.string().trim().min(1),
	password: z.string().min(6),
});

const loginSchema = z.object({
	number: z.string().trim().min(1),
	password: z.string().min(6),
});

const updateUserSchema = z.object({
	userId: z.string().min(1),
	name: z.string().trim().min(1).optional(),
	number: z.string().trim().min(1).optional(),
	password: z.string().min(6).optional(),
	currentPassword: z.string().optional(),
	role: z.enum(["user", "admin", "super_admin"]).optional(),
	isActive: z.boolean().optional(),
});

export const createUser = createServerFn({ method: "POST" })
	.validator(createUserSchema)
	.handler(async ({ data }) => {
		const existingUser = await User.findOne({ number: data.number });
		if (existingUser) {
			throw new Error("এই নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে");
		}

		const user = await User.create({
			name: data.name,
			number: data.number,
			password: data.password,
			apiKey: crypto.randomBytes(32).toString("hex"),
		});

		const session = await useAppSession();
		await session.update({ userId: user._id.toString(), role: user.role });

		const { password: _password, ...safeUser } = user.toObject();
		return {
			success: true,
			user: JSON.parse(JSON.stringify(safeUser)),
			apiKey: user.apiKey,
		};
	});

export const loginUser = createServerFn({ method: "POST" })
	.validator(loginSchema)
	.handler(async ({ data }) => {
		const user = await User.findOne({ number: data.number }).select(
			"+password",
		);
		if (!user || !(await user.comparePassword(data.password))) {
			throw new Error("ভুল নাম্বার বা পাসওয়ার্ড");
		}
		if (!user.isActive) throw new Error("এই অ্যাকাউন্টটি নিষ্ক্রিয়");

		const session = await useAppSession();
		await session.update({ userId: user._id.toString(), role: user.role });

		const {
			password: _password,
			apiKey: _apiKey,
			...safeUser
		} = user.toObject();
		return JSON.parse(JSON.stringify(safeUser));
	});

export const logoutUser = createServerFn({ method: "POST" }).handler(
	async () => {
		const session = await useAppSession();
		await session.clear();
	},
);

export const validateUser = createServerFn({ method: "GET" }).handler(
	async () => {
		const session = await useAppSession();
		if (!session.data.userId) return null;

		const user = await User.findById(session.data.userId);
		if (!user?.isActive) return null;

		const {
			password: _password,
			apiKey: _apiKey,
			...safeUser
		} = user.toObject();
		return JSON.parse(JSON.stringify(safeUser));
	},
);

export const updateUser = createServerFn({ method: "POST" })
	.middleware([authMiddleware])
	.validator(updateUserSchema)
	.handler(async ({ data, context }) => {
		const isOwner = context.actor.id === data.userId;
		const isSuperAdmin = context.actor.role === "super_admin";
		if (!isOwner && !isSuperAdmin) throw new Error("Forbidden");

		const userQuery = User.findById(data.userId);
		if (data.password !== undefined) userQuery.select("+password");

		const user = await userQuery;
		if (!user) throw new Error("User not found");

		if (data.password !== undefined) {
			if (
				!data.currentPassword ||
				!(await user.comparePassword(data.currentPassword))
			) {
				throw new Error("বর্তমান পাসওয়ার্ড সঠিক নয়");
			}
			user.password = data.password;
		}
		if (data.name !== undefined) user.name = data.name;
		if (data.number !== undefined) user.number = data.number;

		if (isSuperAdmin) {
			if (data.role !== undefined) user.role = data.role;
			if (data.isActive !== undefined) user.isActive = data.isActive;
		} else if (data.role !== undefined || data.isActive !== undefined) {
			throw new Error("Only a super admin can update role or status");
		}

		try {
			await user.save();
		} catch (error) {
			if (error?.code === 11000) {
				throw new Error("এই নম্বরটি ইতিমধ্যে ব্যবহার করা হয়েছে");
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
