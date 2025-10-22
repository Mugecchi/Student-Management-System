import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoute from "./routes/authRoute.js";
import registrarRoute from "./routes/registrarRoute.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = ENV.PORT || 5000;

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
await connectDB();
// Middleware
app.use(
	cors({
		origin:
			ENV.NODE_ENV === "development" ? "http://localhost:5173" : ENV.CLIENT_URL,
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/registrar", registrarRoute);

// ✅ Serve frontend (dist folder)
app.use(express.static(path.join(__dirname, "../dist")));

// ✅ SPA fallback (non-API routes)
app.get(/^\/(?!api|ws).*/, (req, res) => {
	res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// Start server
app.listen(PORT, () => {
	if (ENV.NODE_ENV === "development") console.log(`Running on Port: ${PORT}`);
	console.log(`http://localhost:${PORT}`);
});