import express from "express";
import {
	addTeacherSchedule,
	getAllSchedules,
	getTeachers,
} from "../controllers/scheduleController.js";
import { protectRoute, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Only allow admin or registrar to add schedules
router.post(
	"/add",
	protectRoute,
	authorize("admin", "Registrar"),
	addTeacherSchedule
);
router.get(
	"/get",
	protectRoute,
	authorize("admin", "Registrar"),
	getAllSchedules
);
router.get("/teachers", getTeachers);

export default router;
