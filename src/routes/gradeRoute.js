import express from "express";
import {
	assignGrade,
	getAllGrades,
	getDashboardData,
	getStudentGrades,
} from "../controllers/gradeController.js";
import { protectRoute, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// Only allow teachers, admin, or registrar to assign grades
router.post(
	"/assign",
	protectRoute,
	authorize("teacher", "admin", "Registrar"),
	assignGrade
);
router.get(
	"/all",
	protectRoute,
	authorize("teacher", "admin", "Registrar"),
	getAllGrades
);
router.get("/own", protectRoute, getStudentGrades);
router.get("/dashboard", protectRoute, getDashboardData);
export default router;
