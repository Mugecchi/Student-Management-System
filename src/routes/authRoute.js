import express from "express";
import { signup } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.get("/login", (req, res) => {
	res.send("Signup Endpoint");
});

router.get("/update", (req, res) => {
	res.send("Signup Endpoint");
});

router.get("/logout", (req, res) => {
	res.send("Signup Endpoint");
});

export default router;
