import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoute from "./routes/authRoute.js";
import registrarRoute from "./routes/registrarRoute.js";
import scheduleRoute from "./routes/scheduleRoute.js";
import gradeRoute from "./routes/gradeRoute.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = ENV.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
await connectDB();
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
app.use("/api/schedule", scheduleRoute);
app.use("/api/grade", gradeRoute);

app.use(express.static(path.join(__dirname, "../dist")));

app.get(/^\/(?!api|ws).*/, (req, res) => {
	res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(PORT, () => {
	if (ENV.NODE_ENV === "development") console.log(`Running on Port: ${PORT}`);
	console.log(`http://localhost:${PORT}`);
	connectDB();
});
export default app;
