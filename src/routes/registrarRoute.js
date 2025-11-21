import express from "express";
import {
	addSubject,
	deleteStudent,
	getAcademicYears,
	getAllStudents,
	getAllSubjects,
	getStudentById,
	studentEnrollment,
} from "../controllers/registrarController.js";
import { authorize, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protectRoute);

// apply role-based authorization per-route instead of globally
router.post(
	"/enroll",
	authorize("Registrar", "admin", "teacher"),
	studentEnrollment
);
router.get(
	"/students",
	authorize("Registrar", "admin", "teacher"),
	getAllStudents
);
router.get(
	"/students/:id",
	authorize("Registrar", "admin", "teacher"),
	getStudentById
);
router.delete(
	"/students/:id",
	authorize("Registrar", "admin", "teacher"),
	deleteStudent
);
router.get(
	"/academic-years",
	authorize("Registrar", "admin", "teacher"),
	getAcademicYears
);
router.post(
	"/add-subject",
	authorize("Registrar", "admin", "teacher"),
	addSubject
);

// allow students to access subjects while other routes remain restricted
router.get("/subjects", getAllSubjects);
export default router;
