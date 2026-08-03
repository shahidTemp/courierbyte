import crypto from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import bcrypt from "bcrypt";
import { z } from "zod";
import { User } from "@/server/models/user.model";
import { useAppSession } from "@/utils/session";

const createUserSchema = z.object({
	name: z.string().min(1),
	number: z.string().min(1),
	password: z.string().min(6),
});

const loginSchema = z.object({
	number: z.string().min(1),
	password: z.string().min(6),
});

export const createUser = createServerFn({ method: "POST" })
	.validator(createUserSchema)
	.handler(async ({ data }) => {
		const existingUser = await User.findOne({ number: data.number });
		if (existingUser) {
			throw new Error("এই নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট আছে");
		}

		const hashedPassword = await bcrypt.hash(data.password, 12);
		const apiKey = crypto.randomBytes(32).toString("hex");

		console.log("hashedPassword :- ", hashedPassword);
		console.log("api key :- ", apiKey);

		const user = await User.create({
			name: data.name,
			number: data.number,
			password: hashedPassword,
			apiKey,
		});

		// সাইনআপ সফল হলে সাথে সাথে session cookie সেট করে দিচ্ছি
		const session = await useAppSession();
		await session.update({ userId: user._id.toString(), role: user.role });
		return {
			success: true as const,
			user: JSON.parse(JSON.stringify(user)), // Mongoose ObjectId কে JSON এ convert করার জন্য
			apiKey,
		};
	});

export const loginUser = createServerFn({ method: "POST" })
	.validator(loginSchema)
	.handler(async ({ data }) => {
		const user = await User.findOne({ number: data.number }).select(
			"+password",
		);
		if (!user) throw new Error("ভুল নাম্বার বা পাসওয়ার্ড");

		const isValid = await bcrypt.compare(data.password, user.password);
		if (!isValid) throw new Error("ভুল নাম্বার বা পাসওয়ার্ড");

		const session = await useAppSession();
		await session.update({ userId: user._id.toString(), role: user.role });

		return JSON.parse(JSON.stringify(user));
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
		return await User.findById(session.data.userId);
	},
);

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
	const users = await User.find()
		.select("name number isActive role createdAt updatedAt")
		.lean();

	return JSON.parse(JSON.stringify(users)); // Mongoose ObjectId কে JSON এ convert করার জন্য
});
