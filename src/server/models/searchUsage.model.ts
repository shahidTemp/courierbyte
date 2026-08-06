import mongoose from "mongoose";

const { Schema } = mongoose;

const searchUsageSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "UserId is required"],
		},
		subscriptionId: {
			type: Schema.Types.ObjectId,
			ref: "userSubscription",
			required: [true, "SubscriptionId is required"],
		},
	},
	{
		timestamps: true,
	},
);

searchUsageSchema.index({ userId: 1, createdAt: 1 });

export const SearchUsage =
	mongoose.models?.SearchUsage ||
	mongoose.model("SearchUsage", searchUsageSchema);
