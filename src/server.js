import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/authRoute.js";
import { connectDB } from "./lib/db.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/auth", authRoute);

app.listen(PORT, () => {
	process.env.NODE_ENV === "development" &&
		console.log(`Running on Port: ${PORT}`);
	console.log(`http://localhost:${PORT}`);
	connectDB();
});
