// @ts-nocheck
import crypto from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import mongoose from "mongoose";
import { z } from "zod";
import { User } from "@/server/models/user.model";
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

const updateUserSchema = z
	.object({
		userId: z
			.string()
			.refine(mongoose.Types.ObjectId.isValid, "Invalid user ID"),
		name: z.string().trim().min(1).optional(),
		number: z.string().trim().min(1).optional(),
		password: z.string().min(6).optional(),
		role: z.enum(["user", "admin", "super_admin"]).optional(),
		isActive: z.boolean().optional(),
	})
	.strict()
	.refine(
		({ name, number, password, role, isActive }) =>
			name !== undefined ||
			number !== undefined ||
			password !== undefined ||
			role !== undefined ||
			isActive !== undefined,
		{
			message: "At least one field is required to update the user",
		},
	);

const toSafeUser = (user) => {
	const { password: _password, apiKey: _apiKey, ...safeUser } = user;
	return JSON.parse(JSON.stringify(safeUser));
};

const getSessionUser = async () => {
	const session = await useAppSession();
	if (!session.data.userId) return null;

	return User.findById(session.data.userId);
};

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

		return {
			success: true,
			user: toSafeUser(user.toObject()),
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

		return toSafeUser(user.toObject());
	});

export const logoutUser = createServerFn({ method: "POST" }).handler(
	async () => {
		const session = await useAppSession();
		await session.clear();
	},
);

export const validateUser = createServerFn({ method: "GET" }).handler(
	async () => {
		const user = await getSessionUser();
		return user?.isActive ? toSafeUser(user.toObject()) : null;
	},
);

export const updateUser = createServerFn({ method: "POST" })
	.validator(updateUserSchema)
	.handler(async ({ data }) => {
		const actor = await getSessionUser();
		if (!actor) throw new Error("Unauthorized");
		if (!actor.isActive) throw new Error("এই অ্যাকাউন্টটি নিষ্ক্রিয়");

		const isOwner = actor._id.equals(data.userId);
		const isSuperAdmin = actor.role === "super_admin";
		if (!isOwner && !isSuperAdmin) throw new Error("Forbidden");

		const user = isOwner ? actor : await User.findById(data.userId);
		if (!user) throw new Error("User not found");

		if (data.name !== undefined) user.name = data.name;
		if (data.number !== undefined) user.number = data.number;
		if (data.password !== undefined) user.password = data.password;

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

		const session = await useAppSession();
		if (
			isOwner &&
			isSuperAdmin &&
			(data.role !== undefined || data.isActive !== undefined)
		) {
			if (user.isActive) {
				await session.update({
					userId: user._id.toString(),
					role: user.role,
				});
			} else {
				await session.clear();
			}
		}

		return toSafeUser(user.toObject());
	});
