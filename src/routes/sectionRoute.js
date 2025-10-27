import express from "express";
import {
	AssignStudentToSection,
	getAllAssignedSchedule,
	getStudentsByClassSchedule,
	getStudentsInSection,
} from "../controllers/sectionController.js";
import { authorize, protectRoute } from "../middleware/auth.middleware.js";
import { getTeacherStudents } from "../controllers/gradeController.js";

const router = express.Router();
router.use(protectRoute, authorize("admin", "Registrar"));

router.get("/get", getStudentsInSection);
router.post("/add", AssignStudentToSection);
router.get("/students", getStudentsByClassSchedule);
router.get("/all", getAllAssignedSchedule);
router.get("/classsection", getTeacherStudents);

export default router;
