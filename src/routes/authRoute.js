import express from "express";
import {
	signup,
	login,
	logout,
	updateProfile,
	getAllUsers,
	deactivateUser,
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, (req, res) =>
	res.status(200).json(req.user)
);
router.get("/get-all-users", getAllUsers);
router.post("/deactivate-user/:userId", deactivateUser);
export default router;
