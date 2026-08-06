import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { reload } from "@/server/lib/courierKeyPool";
import { requireRole } from "@/server/middleware";
import { CourierKey } from "@/server/models/courierKey.model";

const adminOnly = requireRole(["admin", "super_admin"]);

const idSchema = z.object({
	id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid key ID"),
});

const createKeySchema = z.object({
	keyValue: z.string().trim().min(1),
	dailyLimit: z.number().finite().int().min(1).default(50),
});

export const getCourierKeys = createServerFn({ method: "GET" })
	.middleware([adminOnly])
	.handler(async () => {
		const keys = await CourierKey.find()
			.select("+keyValue")
			.sort({ createdAt: -1 })
			.lean();

		// never send the full secret to the client
		return JSON.parse(
			JSON.stringify(
				keys.map((key) => ({
					id: String(key._id),
					keyValue: `••••${key.keyValue.slice(-4)}`,
					dailyLimit: key.dailyLimit,
					count: key.count,
					date: key.date,
					status: key.status,
					createdAt: key.createdAt,
				})),
			),
		);
	});

export const createCourierKey = createServerFn({ method: "POST" })
	.middleware([adminOnly])
	.validator(createKeySchema)
	.handler(async ({ data }) => {
		try {
			const key = await CourierKey.create(data);
			await reload(); // pool must see the new key immediately
			return { success: true, id: String(key._id) };
		} catch (error) {
			if (
				error &&
				typeof error === "object" &&
				"code" in error &&
				error.code === 11000
			) {
				throw new Error("This key already exists");
			}
			throw error;
		}
	});

export const toggleCourierKey = createServerFn({ method: "POST" })
	.middleware([adminOnly])
	.validator(idSchema)
	.handler(async ({ data }) => {
		const key = await CourierKey.findById(data.id);
		if (!key) throw new Error("Key not found");

		key.status = key.status === "active" ? "inactive" : "active";
		await key.save();
		await reload(); // drop (or bring back) the key in the pool

		return { success: true, id: data.id, status: key.status };
	});

export const deleteCourierKey = createServerFn({ method: "POST" })
	.middleware([adminOnly])
	.validator(idSchema)
	.handler(async ({ data }) => {
		const deleted = await CourierKey.findByIdAndDelete(data.id);
		if (!deleted) throw new Error("Key not found");

		await reload();
		return { success: true, id: data.id };
	});
