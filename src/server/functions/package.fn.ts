import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/server/middleware";
import { PackageModel } from "@/server/models/package.model";

const packageDataSchema = z.object({
	name: z.string().trim().min(1).max(100),
	description: z.string().trim().min(1).max(2000),
	price: z.number().finite().min(0),
	yearly_price: z.number().finite().min(0),
	duration_in_days: z.number().finite().int().min(1),
	api_call_limit: z.number().finite().int().min(0),
	features: z.array(z.string().trim().min(1).max(200)).max(50),
	is_active: z.boolean(),
});

export const getPackages = createServerFn({ method: "GET" })
	.middleware([requireRole(["admin", "super_admin"])])
	.handler(async () => {
		const packages = await PackageModel.find().sort({ createdAt: -1 }).lean();
		return JSON.parse(JSON.stringify(packages));
	});

export const getActivePackages = createServerFn({ method: "GET" }).handler(
	async () => {
		const packages = await PackageModel.find({ is_active: true })
			.sort({ createdAt: 1 })
			.lean();
		return JSON.parse(JSON.stringify(packages));
	},
);

export const createPackage = createServerFn({ method: "POST" })
	.validator(packageDataSchema)
	.middleware([requireRole(["admin", "super_admin"])])
	.handler(async ({ data }) => {
		try {
			const packageItem = await PackageModel.create(data);
			return JSON.parse(JSON.stringify(packageItem.toObject()));
		} catch (error) {
			if (
				error &&
				typeof error === "object" &&
				"code" in error &&
				error.code === 11000
			) {
				throw new Error("A package with this name already exists");
			}
			throw error;
		}
	});

export const updatePackage = createServerFn({ method: "POST" })
	.middleware([requireRole(["admin", "super_admin"])])
	.validator(
		z
			.object({
				id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid package ID"),
			})
			.extend(packageDataSchema.shape),
	)
	.handler(async ({ data }) => {
		const { id, ...packageData } = data;
		try {
			const packageItem = await PackageModel.findByIdAndUpdate(
				id,
				packageData,
				{ new: true, runValidators: true },
			).lean();

			if (!packageItem) throw new Error("Package not found");
			return JSON.parse(JSON.stringify(packageItem));
		} catch (error) {
			if (
				error &&
				typeof error === "object" &&
				"code" in error &&
				error.code === 11000
			) {
				throw new Error("A package with this name already exists");
			}
			throw error;
		}
	});
