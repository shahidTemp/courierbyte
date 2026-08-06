import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { reload } from "@/server/lib/courierKeyPool";
import { requireRole } from "@/server/middleware";
import { CourierKey } from "@/server/models/courierKey.model";

const superAdminOnly = requireRole("super_admin");

const idSchema = z.object({
	id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid key ID"),
});

const createKeySchema = z.object({
	keyValue: z.string().trim().min(1, "Key value is required"),
	dailyLimit: z.number().finite().int().min(1).default(50),
});

const updateKeySchema = idSchema.extend({
	keyValue: z.string().trim().min(1).optional(),
	dailyLimit: z.number().finite().int().min(1),
});

const statusSchema = idSchema.extend({
	status: z.enum(["active", "inactive"]),
});

const today = () => new Date().toISOString().slice(0, 10);

const isDuplicate = (error: unknown) =>
	typeof error === "object" &&
	error !== null &&
	"code" in error &&
	error.code === 11000;

// Never send the full secret to the client — mask it. Count belongs to today,
// otherwise it is yesterday's leftover and would be misleading.
const toSafeKey = (key: {
	_id: unknown;
	keyValue: string;
	dailyLimit: number;
	count: number;
	date: string;
	status: string;
	createdAt: unknown;
}) => ({
	_id: String(key._id),
	keyValue: `••••${key.keyValue.slice(-4)}`,
	dailyLimit: key.dailyLimit,
	count: key.date === today() ? key.count : 0,
	status: key.status,
	createdAt: key.createdAt,
});

export const getKeys = createServerFn({ method: "GET" })
	.middleware([superAdminOnly])
	.handler(async () => {
		const keys = await CourierKey.find()
			.select("+keyValue")
			.sort({ createdAt: -1 })
			.lean();

		return JSON.parse(JSON.stringify(keys.map(toSafeKey)));
	});

export const createKey = createServerFn({ method: "POST" })
	.middleware([superAdminOnly])
	.validator(createKeySchema)
	.handler(async ({ data }) => {
		try {
			const key = await CourierKey.create(data);
			await reload(); // pool must see the new key immediately
			return JSON.parse(JSON.stringify(toSafeKey(key.toObject())));
		} catch (error) {
			if (isDuplicate(error)) throw new Error("This key already exists");
			throw error;
		}
	});

export const updateKey = createServerFn({ method: "POST" })
	.middleware([superAdminOnly])
	.validator(updateKeySchema)
	.handler(async ({ data }) => {
		const key = await CourierKey.findById(data.id).select("+keyValue");
		if (!key) throw new Error("Key not found");

		if (data.keyValue !== undefined) {
			const duplicate = await CourierKey.findOne({
				keyValue: data.keyValue,
				_id: { $ne: data.id },
			});
			if (duplicate) throw new Error("This key already exists");
			key.keyValue = data.keyValue;
		}

		key.dailyLimit = data.dailyLimit;

		try {
			await key.save();
		} catch (error) {
			if (isDuplicate(error)) throw new Error("This key already exists");
			throw error;
		}

		await reload(); // pick up the new limit in the pool
		return JSON.parse(JSON.stringify(toSafeKey(key.toObject())));
	});

export const updateKeyStatus = createServerFn({ method: "POST" })
	.middleware([superAdminOnly])
	.validator(statusSchema)
	.handler(async ({ data }) => {
		const key = await CourierKey.findByIdAndUpdate(
			data.id,
			{ status: data.status },
			{ new: true, runValidators: true },
		)
			.select("+keyValue")
			.lean();

		if (!key) throw new Error("Key not found");

		await reload(); // drop (or bring back) the key in the pool
		return JSON.parse(JSON.stringify(toSafeKey(key)));
	});

export const deleteKey = createServerFn({ method: "POST" })
	.middleware([superAdminOnly])
	.validator(idSchema)
	.handler(async ({ data }) => {
		const deleted = await CourierKey.findByIdAndDelete(data.id);
		if (!deleted) throw new Error("Key not found");

		await reload();
		return { success: true, id: data.id };
	});
