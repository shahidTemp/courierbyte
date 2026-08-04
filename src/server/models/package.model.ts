import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		yearly_price: {
			type: Number,
			required: true,
			min: 0,
		},
		duration_in_days: {
			type: Number,
			required: true,
			min: [1, "Duration in days must be at least 1"],
		},
		api_call_limit: {
			type: Number,
			required: true,
			min: 0,
		},
		features: {
			type: [String],
			required: true,
			default: [],
		},
		is_active: {
			type: Boolean,
			default: true,
			index: true,
		},
	},
	{
		timestamps: true,
	},
);

export const PackageModel =
	mongoose.models?.Package || mongoose.model("Package", packageSchema);
