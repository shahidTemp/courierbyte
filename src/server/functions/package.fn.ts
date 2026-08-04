// @ts-nocheck
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/server/middleware";
import { PackageModel } from "@/server/models/package.model";
import { useAppSession } from "@/utils/session";

const createPackageSchema = z.object({
	name: z.string().trim().min(1).max(100),
	description: z.string().trim().min(1).max(2000),
	price: z.number().finite().min(0),
	yearly_price: z.number().finite().min(0),
	duration_in_days: z.number().finite().int().min(1),
	api_call_limit: z.number().finite().int().min(0),
	features: z.array(z.string().trim().min(1).max(200)).max(50).default([]),
	is_active: z.boolean().default(true),
});

export const createPackage = createServerFn({ method: "POST" })
	.validator(createPackageSchema)
	.middleware([requireRole(["admin", "super_admin"])])
	.handler(async ({ data }) => {
		const existingPackage = await PackageModel.findOne({ name: data.name });
		if (existingPackage) {
			throw new Error("এই নামে ইতিমধ্যে একটি প্যাকেজ আছে");
		}

		await PackageModel.create({
			name: data.name,
			description: data.description,
			price: data.price,
			yearly_price: data.yearly_price,
			duration_in_days: data.duration_in_days,
			api_call_limit: data.api_call_limit,
			features: data.features,
			is_active: data.is_active,
		});

		return {
			success: true,
			message: "প্যাকেজ সফলভাবে তৈরি হয়েছে",
		};
	});
