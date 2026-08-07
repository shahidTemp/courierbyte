// @ts-nocheck
import mongoose from "mongoose";
import { COURIER_ERROR_CATEGORIES } from "@/server/lib/courierErrorCategories";

const courierErrorLogSchema = new mongoose.Schema(
	{
		// Which pool key failed — null when no key was available at all
		keyId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "CourierKey",
			default: null,
			index: true,
		},

		// Failure taxonomy — see src/server/lib/courierErrorLog.ts
		category: {
			type: String,
			enum: COURIER_ERROR_CATEGORIES,
			required: true,
			index: true,
		},

		// HTTP status returned by the provider, if any
		httpStatus: { type: Number, default: null },

		// The message surfaced by checkCourier
		message: { type: String, required: true },

		// The provider's own error text extracted from its response body
		providerMessage: { type: String, default: null },

		// Underlying cause (network failure, JSON parse error, …)
		detail: { type: String, default: null },

		// Masked customer number (e.g. 017****5678) — never the full number
		phone: { type: String, default: null },

		stack: { type: String, default: null },

		// Whether this failure pushed the key over the 3-strike limit
		keyDeactivated: { type: Boolean, default: false, index: true },
	},
	{ timestamps: true },
);

// Latest-error-per-key lookups for the admin keys table
courierErrorLogSchema.index({ keyId: 1, createdAt: -1 });
courierErrorLogSchema.index({ category: 1, createdAt: -1 });

// Avoid "Cannot overwrite model" during hot reload
export const CourierErrorLog =
	mongoose.models?.CourierErrorLog ||
	mongoose.model("CourierErrorLog", courierErrorLogSchema);
