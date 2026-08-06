import crypto from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireRole } from "@/server/middleware";
import { User } from "@/server/models/user.model";

const adminFields = "name number isActive role createdAt updatedAt";

const adminIdSchema = z.object({
	id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid admin ID"),
});

const createAdminSchema = z.object({
	name: z.string().trim().min(1),
	number: z.string().trim().min(1),
	password: z.string().min(6),
});

const updateAdminSchema = adminIdSchema.extend({
	name: z.string().trim().min(1),
	number: z.string().trim().min(1),
	password: z.string().min(6).optional(),
});

const serializeAdmin = (admin: unknown) => JSON.parse(JSON.stringify(admin));

const toSafeAdmin = (admin: {
	_id: unknown;
	name: string;
	number: string;
	isActive: boolean;
	role: string;
	createdAt: unknown;
	updatedAt: unknown;
}) =>
	serializeAdmin({
		_id: admin._id,
		name: admin.name,
		number: admin.number,
		isActive: admin.isActive,
		role: admin.role,
		createdAt: admin.createdAt,
		updatedAt: admin.updatedAt,
	});

export const getAdmins = createServerFn({ method: "GET" })
	.middleware([requireRole("super_admin")])
	.handler(async () => {
		const admins = await User.find({ role: "admin" })
			.select(adminFields)
			.sort({ createdAt: -1 })
			.lean();

		return serializeAdmin(admins);
	});

export const createAdmin = createServerFn({ method: "POST" })
	.middleware([requireRole("super_admin")])
	.validator(createAdminSchema)
	.handler(async ({ data }) => {
		const existingAdmin = await User.findOne({ number: data.number });
		if (existingAdmin) {
			throw new Error("An account with this number already exists");
		}

		try {
			const admin = await User.create({
				name: data.name,
				number: data.number,
				password: data.password,
				apiKey: crypto.randomBytes(32).toString("hex"),
				isActive: true,
				role: "admin",
			});

			return toSafeAdmin(admin.toObject());
		} catch (error) {
			if (
				error &&
				typeof error === "object" &&
				"code" in error &&
				error.code === 11000
			) {
				throw new Error("An account with this number already exists");
			}
			throw error;
		}
	});

export const deleteAdminById = createServerFn({ method: "POST" })
	.middleware([requireRole("super_admin")])
	.validator(adminIdSchema)
	.handler(async ({ data }) => {
		const deletedAdmin = await User.findOneAndDelete({
			_id: data.id,
			role: "admin",
		});

		if (!deletedAdmin) {
			throw new Error("Admin not found");
		}

		return { success: true, id: data.id };
	});

export const updateAdmin = createServerFn({ method: "POST" })
	.middleware([requireRole("super_admin")])
	.validator(updateAdminSchema)
	.handler(async ({ data }) => {
		const duplicateAdmin = await User.findOne({
			number: data.number,
			_id: { $ne: data.id },
		});
		if (duplicateAdmin) {
			throw new Error("An account with this number already exists");
		}

		const admin = await User.findOne({ _id: data.id, role: "admin" });
		if (!admin) throw new Error("Admin not found");

		admin.name = data.name;
		admin.number = data.number;
		if (data.password !== undefined) admin.password = data.password;

		try {
			await admin.save();
		} catch (error) {
			if (
				error &&
				typeof error === "object" &&
				"code" in error &&
				error.code === 11000
			) {
				throw new Error("An account with this number already exists");
			}
			throw error;
		}

		return toSafeAdmin(admin.toObject());
	});
