import { createServerFn } from "@tanstack/react-start";
import { randomBytes, scrypt } from "node:crypto";
import { User } from "@/server/models/user.model";

type RegisterInput = {
	name: string;
	number: string;
	password: string;
};

const PHONE_NUMBER = /^01[3-9]\d{8}$/;

function validateRegisterInput(input: unknown): RegisterInput {
	if (!input || typeof input !== "object") {
		throw new Error("Invalid registration data");
	}

	const { name, number, password } = input as Record<string, unknown>;
	const normalizedName = typeof name === "string" ? name.trim() : "";
	const normalizedNumber = typeof number === "string" ? number.trim() : "";

	if (
		normalizedName.length < 1 ||
		normalizedName.length > 100 ||
		!PHONE_NUMBER.test(normalizedNumber) ||
		typeof password !== "string" ||
		password.length < 8 ||
		password.length > 128
	) {
		throw new Error("Invalid registration data");
	}

	return { name: normalizedName, number: normalizedNumber, password };
}

function hashPassword(password: string): Promise<string> {
	const salt = randomBytes(16);

	return new Promise((resolve, reject) => {
		scrypt(password, salt, 64, (error, derivedKey) => {
			if (error) {
				reject(error);
				return;
			}

			resolve(`${salt.toString("hex")}:${derivedKey.toString("hex")}`);
		});
	});
}

function isDuplicateKeyError(error: unknown): boolean {
	return (
		error instanceof Error &&
		"code" in error &&
		error.code === 11000
	);
}

export const getUsers = createServerFn({ method: "GET" }).handler(async () => {
	const users = await User.find()
		.select("name number isActive role createdAt updatedAt")
		.lean();

	return users.map((user) => ({
		id: String(user._id),
		name: user.name,
		number: user.number,
		isActive: user.isActive,
		role: user.role,
		createdAt: user.createdAt.toISOString(),
		updatedAt: user.updatedAt.toISOString(),
	}));
});

export const createUser = createServerFn({ method: "POST" })
	.validator(validateRegisterInput)
	.handler(async ({ data }) => {
		try {
			const passwordHash = await hashPassword(data.password);
			const apiKey = randomBytes(32).toString("hex");
			const apiKeyHash = await hashPassword(apiKey);
			const user = await User.create({
				name: data.name,
				number: data.number,
				password: passwordHash,
				apiKey: apiKeyHash,
			});

			return {
				success: true as const,
				user: {
					id: String(user._id),
					name: user.name,
					number: user.number,
				},
				apiKey,
			};
		} catch (error) {
			if (isDuplicateKeyError(error)) {
				return {
					success: false as const,
					message: "এই মোবাইল নাম্বারটি ইতিমধ্যে নিবন্ধিত।",
				};
			}

			console.error("User registration failed", error);
			throw new Error("অ্যাকাউন্ট তৈরি করা যায়নি। পরে আবার চেষ্টা করুন।");
		}
	});
