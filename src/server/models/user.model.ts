import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		number: { type: String, required: true, unique: true },
		password: { type: String, required: true, select: false },
		apiKey: {
			type: String,
			required: true,
			unique: true,
			index: true,
			select: false,
		},
		isActive: { type: Boolean, default: true },
		role: {
			type: String,
			enum: ["user", "admin", "super_admin"],
			default: "user",
			index: true,
		},
	},
	{ timestamps: true },
);

userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

// Avoid "Cannot overwrite model" during hot reload.
export const User = mongoose.models?.User || mongoose.model("User", userSchema);
