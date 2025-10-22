import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
	try {
		const conn = await mongoose.connect(ENV.MONGO_URI);
		console.log("mongo DB connection success:", conn.connection.host);
	} catch (err) {
		console.log("connection error:", err);
		process.exit(1);
	}
};
