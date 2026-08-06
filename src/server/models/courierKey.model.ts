// @ts-nocheck
import mongoose from "mongoose";

const courierKeySchema = new mongoose.Schema(
	{
		// The actual courier API key — a secret, never returned by default
		keyValue: {
			type: String,
			required: true,
			unique: true,
			index: true,
			select: false,
		},

		// Provider cap per key per day
		dailyLimit: { type: Number, required: true, default: 50 },

		// Lifecycle flag: "inactive" = revoked/deleted or auto-deactivated on 401/403
		status: {
			type: String,
			enum: ["active", "inactive"],
			default: "active",
			index: true,
		},

		// --- Usage counters (reset automatically on a new UTC day) ---
		count: { type: Number, default: 0 }, // requests used today on this key
		date: {
			type: String,
			default: () => new Date().toISOString().slice(0, 10), // "2026-08-06"
		},
	},
	{ timestamps: true },
);

// Fast query for the pool: active keys, least-used first
courierKeySchema.index({ status: 1, count: 1 });

// Auto-reset the counter when the day rolls over (runs on every save)
courierKeySchema.pre("save", function () {
	const today = new Date().toISOString().slice(0, 10);
	if (this.date !== today) {
		this.count = 0;
		this.date = today;
	}
});

// Avoid "Cannot overwrite model" during hot reload
export const CourierKey =
	mongoose.models?.CourierKey || mongoose.model("CourierKey", courierKeySchema);
