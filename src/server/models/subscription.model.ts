import mongoose from "mongoose";

const { Schema } = mongoose;

const userSubscriptionSchema = new Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "UserId is required"],
		},
		packageId: {
			type: Schema.Types.ObjectId,
			ref: "Package",
			required: [true, "Membership Id  is required"],
		},
		packageSnapshot: {
			name: { type: String, required: [true, "Package name is required"] },
			price: {
				type: Number,
				required: [true, "Package price is required"],
				min: 0,
			},
			api_call_limit: {
				type: Number,
				required: [true, "Package API call limit is required"],
				min: 0,
			},
		},
		planType: {
			type: String,
			enum: ["monthly", "yearly"],
			required: [true, "Plan Type is required"],
		},
		status: {
			type: String,
			enum: ["pending", "active", "expired", "cancelled"],
			default: "pending",
		},
		paid_amount: {
			type: Number,
			required: [true, "Paid Amount is required"],
			min: 0,
		},
		api_calls_used: {
			type: Number,
			default: 0,
			min: 0,
		},
		// Requests reserved in-flight. These count against the package limit
		// until the provider request succeeds or fails.
		api_calls_pending: {
			type: [
				{
					id: { type: String, required: true },
					createdAt: { type: Date, required: true },
				},
			],
			default: [],
		},
		end_date: {
			type: Date,
			required: [true, "End Date is required"],
		},
		payment: {
			transactionId: { type: String, unique: true, sparse: true },
			senderNumber: String,
		},
		verifiedBy: String,
	},
	{
		timestamps: true,
	},
);

userSubscriptionSchema.index({ userId: 1, status: 1 });

export const userSubscription =
	mongoose.models?.userSubscription ||
	mongoose.model("userSubscription", userSubscriptionSchema);
