import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CourierStatSchema = new Schema(
	{
		name: { type: String, required: true },
		total_parcel: { type: Number, default: 0 },
		success_parcel: { type: Number, default: 0 },
		cancelled_parcel: { type: Number, default: 0 },
		success_ratio: { type: Number, default: 0 },
	},
	{ _id: false },
);

const SummarySchema = new Schema(
	{
		total_parcel: { type: Number, default: 0 },
		success_parcel: { type: Number, default: 0 },
		cancelled_parcel: { type: Number, default: 0 },
		success_ratio: { type: Number, default: 0 },
	},
	{ _id: false },
);

const ReportSchema = new Schema(
	{
		name: { type: String },
		rating: { type: Number, min: 1, max: 5 },
		comment: { type: String },
		created_at: { type: Date },
	},
	{ _id: false },
);

const CourierCheckSchema = new Schema(
	{
		phone: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true,
		},
		status: { type: String, default: "success" },

		couriers: {
			type: Map,
			of: CourierStatSchema,
			default: () => new Map(),
		},

		summary: { type: SummarySchema, default: () => ({}) },

		reports: { type: [ReportSchema], default: [] },
	},
	{ timestamps: true },
);

export const CourierCheck =
	mongoose.models?.CourierCheck ||
	mongoose.model("CourierCheck", CourierCheckSchema);
