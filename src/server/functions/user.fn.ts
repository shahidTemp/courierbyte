import { createServerFn } from "@tanstack/react-start";
import { createHash, randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";
import { User } from "@/server/models/user.model";

type RegisterInput = {
	name: string;
	number: string;
	password: string;
};

const PHONE_NUMBER = /^01[3-9]\d{8}$/;
const deriveKey = promisify(scrypt);

function validateRegisterInput(input: unknown): RegisterInput {
	const { name, number, password } = (input ?? {}) as Record<string, unknown>;
	const normalizedName = typeof name === "string" ? name.trim() : "";
	const normalizedNumber = typeof number === "string" ? number.trim() : "";

	if (
		normalizedName.length === 0 ||
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

async function hashPassword(password: string) {
	const salt = randomBytes(16);
	const key = await deriveKey(password, salt, 64);
	return `${salt.toString("hex")}:${key.toString("hex")}`;
}

function hashApiKey(apiKey: string) {
	return createHash("sha256").update(apiKey).digest("hex");
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
		if (await User.exists({ number: data.number })) {
			return {
				success: false as const,
				message: "এই মোবাইল নাম্বারটি ইতিমধ্যে নিবন্ধিত।",
			};
		}

		const apiKey = randomBytes(32).toString("hex");
		const user = await User.create({
			name: data.name,
			number: data.number,
			password: await hashPassword(data.password),
			apiKey: hashApiKey(apiKey),
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
	});
