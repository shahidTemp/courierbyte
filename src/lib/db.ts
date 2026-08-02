//@ts-nocheck

import { definePlugin } from "nitro";
import mongoose from "mongoose";
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




export default definePlugin(async (nitroApp) => {
  await connectDB(); // 👈 সার্ভার শুরু হবার সময় একবারই রান হবে
});