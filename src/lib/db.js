// lib/db.js
import mongoose from "mongoose";
import { ENV } from "./env.js";

let isConnected = false; // Global flag for serverless reuse

export const connectDB = async () => {
  if (isConnected) {
    // 🟢 Already connected
    return;
  }

  try {
    const conn = await mongoose.connect(ENV.MONGO_URI, {
      
      serverSelectionTimeoutMS: 10000, // Prevent indefinite waits
    });

    isConnected = true;
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};
