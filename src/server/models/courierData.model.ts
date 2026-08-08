import mongoose from "mongoose";

const { Schema } = mongoose;

const CourierCheckSchema = new Schema(
	{
		phone: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true,
		},
		// Raw payload returned by the courier provider (arbitrary JSON).
		data: { type: Schema.Types.Mixed, default: {} },
		// Raw customer reviews returned by the reviews provider.
		reports: { type: [Schema.Types.Mixed], default: [] },
	},
	{ timestamps: true },
);

export const CourierCheck =
	mongoose.models?.CourierCheck ||
	mongoose.model("CourierCheck", CourierCheckSchema);
