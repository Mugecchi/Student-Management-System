// server.js
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

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Connect to DB immediately (not inside listen)
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

// Serve frontend
app.use(express.static(path.join(__dirname, "../dist")));
app.get(/^\/(?!api|ws).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// ✅ Export for Vercel (no listen)
export default app;
