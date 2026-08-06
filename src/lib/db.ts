// @ts-nocheck

import mongoose from "mongoose";
import { definePlugin } from "nitro";
import { expireSubscriptions } from "@/server/lib/subscription";
import { env } from "./env";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(env.MONGODB_URI, {
			authSource: "admin",
		});
		console.log(`✅ MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(`❌ MongoDB connection failed: ${error.message}`);
		process.exit(1);
	}
};

export default definePlugin(async () => {
	await connectDB();
	await expireSubscriptions();
	setInterval(
		() => {
			expireSubscriptions().catch((error) =>
				console.error("Subscription expiration cleanup failed:", error),
			);
		},
		60 * 60 * 1000,
	);
});
