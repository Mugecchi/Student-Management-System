import express from "express";
import {
	addAcademicYear,
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
router.use(authorize("Registrar", "admin", "teacher"));
router.post("/enroll", studentEnrollment);
router.post("/academic-year", addAcademicYear);
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);
router.delete("/students/:id", deleteStudent);
router.get("/academic-years", getAcademicYears);
router.post("/add-subject", addSubject);
router.get("/subjects", getAllSubjects);
export default router;
