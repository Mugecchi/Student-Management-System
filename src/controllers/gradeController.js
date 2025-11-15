import Grade from "../models/Grade.js";
import ClassSchedule from "../models/ClassSchedule.js";
import StudentSection from "../models/StudentSection.js";
import Student from "../models/Student.js";
import User from "../models/User.js";
import Subject from "../models/Subject.js";
import Section from "../models/Section.js";
import AcademicYear from "../models/AcademicYear.js";
// Dashboard API: Aggregates key metrics for dashboard display
export const getDashboardData = async (req, res) => {
	try {
		// Total counts
		const studentCount = await User.countDocuments({role: " student"});
		const teacherCount = await User.countDocuments({ role: "teacher" });
		const subjectCount = await Subject.countDocuments();
		const sectionCount = await Section.countDocuments();

		// Recent grades (last 5 entries)
		const recentGrades = await Grade.find()
			.sort({ updatedAt: -1 })
			.limit(5)
			.populate({
				path: "studentId",
				select: "studentNumber first_name last_name",
			})
			.populate({
				path: "scheduleId",
				populate: { path: "subjectId", select: "subjectName subjectCode" },
			})
			.select(
				"firstQuarterGrade secondQuarterGrade thirdQuarterGrade fourthQuarterGrade remarks updatedAt"
			);

		// Upcoming schedules (next 5 by date)
		const upcomingSchedules = await ClassSchedule.find({
			date: { $gte: new Date() },
		})
			.sort({ date: 1 })
			.limit(5)
			.populate({
				path: "teacherId",
				select: "first_name last_name username",
			})
			.populate({
				path: "subjectId",
				select: "subjectName subjectCode",
			})
			.populate({
				path: "sectionId",
				select: "sectionName",
			})
			.select("date time subjectId teacherId sectionId");

		// Current academic year info
		const currentAcadYear = await AcademicYear.findOne({ status: "active" });

		res.status(200).json({
			studentCount,
			teacherCount,
			subjectCount,
			sectionCount,
			recentGrades,
			upcomingSchedules,
			currentAcadYear,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching dashboard data", error: error.message });
	}
};
// Assign or update a grade for a student
export const assignGrade = async (req, res) => {
	try {
		const {
			studentId,
			scheduleId,
			firstQuarterGrade,
			secondQuarterGrade,
			thirdQuarterGrade,
			fourthQuarterGrade,
			remarks,
			enteredBy,
		} = req.body;

		if (!studentId || !scheduleId) {
			return res
				.status(400)
				.json({ message: "Missing required fields: studentId and scheduleId" });
		}

		// Upsert grade (create or update)
		const grade = await Grade.findOneAndUpdate(
			{ studentId, scheduleId },
			{
				firstQuarterGrade,
				secondQuarterGrade,
				thirdQuarterGrade,
				fourthQuarterGrade,
				remarks,
				enteredBy,
			},
			{ upsert: true, new: true, setDefaultsOnInsert: true }
		);

		res
			.status(200)
			.json({ message: "Grade assigned/updated successfully", grade });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error assigning grade", error: error.message });
	}
};

// Get all grades (optionally populate subject and student info)
export const getAllGrades = async (req, res) => {
	try {
		const grades = await Grade.find()
			.populate({
				path: "studentId",
				select: "studentNumber first_name last_name",
			})
			.populate({
				path: "scheduleId",
				populate: { path: "subjectId", select: "subjectName subjectCode" },
			})
			.populate({
				path: "enteredBy",
				select: "first_name last_name username",
			});
		res.status(200).json(grades);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching grades", error: error.message });
	}
};

export const getTeacherStudents = async (req, res) => {
	try {
		const teacherId = req.user._id;

		// 1. Find all ClassSchedules for this teacher
		const schedules = await ClassSchedule.find({ teacherId })
			.select("sectionId")
			.lean();
		const sectionNames = schedules.map((s) => s.sectionId); // If sectionId is a name (string)

		// 2. Find all StudentSection records for these sections
		const studentSections = await StudentSection.find({
			sectionName: { $in: sectionNames },
			status: "active",
		})
			.select("studentId")
			.lean();

		const studentIds = studentSections.map((ss) => ss.studentId);

		// 3. Get Student records and populate user info
		const students = await Student.find({ _id: { $in: studentIds } })
			.populate("userId", "first_name last_name username middle_name phone")
			.lean();

		res.status(200).json({ students });
	} catch (error) {
		res.status(500).json({
			message: "Error fetching teacher's students",
			error: error.message,
		});
	}
};
export const getStudentGrades = async (req, res) => {
	try {
		// Find the Student document for the logged-in user
		const student = await Student.findOne({ userId: req.user._id }).lean();
		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}
		const grades = await Grade.find({ studentId: student._id }).select(
			"firstQuarterGrade secondQuarterGrade thirdQuarterGrade fourthQuarterGrade -_id"
		);

		res.status(200).json({ grades });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching grades", error: error.message });
	}
};
