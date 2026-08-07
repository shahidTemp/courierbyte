import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { reload } from "@/server/lib/courierKeyPool";
import { requireRole } from "@/server/middleware";
import { CourierErrorLog } from "@/server/models/courierErrorLog.model";
import { CourierKey } from "@/server/models/courierKey.model";

const superAdminOnly = requireRole("super_admin");

const idSchema = z.object({
	id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid key ID"),
});

const createKeySchema = z.object({
	keyValue: z.string().trim().min(1, "Key value is required"),
	dailyLimit: z.number().finite().int().min(1).default(50),
	status: z.enum(["active", "inactive"]).default("active"),
});

const updateKeySchema = idSchema.extend({
	keyValue: z.string().trim().min(1).optional(),
	dailyLimit: z.number().finite().int().min(1),
	status: z.enum(["active", "inactive"]).optional(),
});

const keyErrorsSchema = z.object({
	keyId: z
		.string()
		.regex(/^[a-f\d]{24}$/i, "Invalid key ID")
		.optional(),
});

const today = () => new Date().toISOString().slice(0, 10);

const isDuplicate = (error: unknown) =>
	typeof error === "object" &&
	error !== null &&
	"code" in error &&
	error.code === 11000;

// Never send the full secret to the client — mask it. Count belongs to today,
// otherwise it is yesterday's leftover and would be misleading.
const maskKeyValue = (keyValue: string) => `••••${keyValue.slice(-4)}`;

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
	keyValue: maskKeyValue(key.keyValue),
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
		if (data.status !== undefined) {
			key.status = data.status;
		}

		try {
			await key.save();
		} catch (error) {
			if (isDuplicate(error)) throw new Error("This key already exists");
			throw error;
		}

		await reload(); // pool must pick up the new limit/status immediately
		return JSON.parse(JSON.stringify(toSafeKey(key.toObject())));
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

export const getKeyErrors = createServerFn({ method: "GET" })
	.middleware([superAdminOnly])
	.validator(keyErrorsSchema)
	.handler(async ({ data }) => {
		// No keyId → all keys' errors (when the page is visited directly).
		const filter = data.keyId ? { keyId: data.keyId } : {};
		const KEY_ERROR_LIMIT = 100;
		const errors = await CourierErrorLog.find(filter)
			.sort({ createdAt: -1 })
			.limit(KEY_ERROR_LIMIT)
			.lean();

		// Resolve masked key values only for keys that actually have errors.
		const keyIds = [
			...new Set(
				errors
					.map((error) => (error.keyId ? String(error.keyId) : ""))
					.filter(Boolean),
			),
		];
		const keys = keyIds.length
			? await CourierKey.find({ _id: { $in: keyIds } })
					.select("+keyValue")
					.lean()
			: [];
		const keyValueByKeyId = new Map(
			keys.map((key) => [String(key._id), maskKeyValue(key.keyValue)]),
		);

		const rows = errors.map((error) => ({
			_id: String(error._id),
			keyId: error.keyId ? String(error.keyId) : null,
			keyValue: error.keyId
				? (keyValueByKeyId.get(String(error.keyId)) ?? null)
				: null,
			category: error.category,
			httpStatus: error.httpStatus,
			message: error.message,
			providerMessage: error.providerMessage,
			detail: error.detail,
			phone: error.phone,
			keyDeactivated: error.keyDeactivated,
			createdAt: error.createdAt,
		}));

		// Key info for the page header when filtered by key.
		let key = null;
		if (data.keyId) {
			const found = await CourierKey.findById(data.keyId)
				.select("+keyValue")
				.lean();
			if (found) {
				key = {
					_id: String(found._id),
					keyValue: maskKeyValue(found.keyValue),
				};
			}
		}

		return JSON.parse(
			JSON.stringify({
				errors: rows,
				key,
				hasMore: errors.length === KEY_ERROR_LIMIT,
			}),
		);
	});
