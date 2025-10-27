import ClassSchedule from "../models/ClassSchedule.js";
import Section from "../models/Section.js";
import Student from "../models/Student.js";
import StudentSection from "../models/StudentSection.js";

export const createSection = async (req, res) => {
	try {
		const { sectionName, academicYearId, yearLevel, maxCapacity } = req.body;
		const createdBy = req.user._id;
		const newSection = new Section({
			sectionName,
			academicYearId,
			yearLevel,
			maxCapacity,
			createdBy,
		});
		await newSection.save();
		res
			.status(201)
			.json({ message: "Section created successfully", section: newSection });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error creating section", error: error.message });
	}
};

export const getAllSections = async (req, res) => {
	try {
		const sections = await Section.find().populate("academicYearId", "year");
		res.status(200).json({ sections });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error Fetching Sections", error: error.message });
	}
};

export const AssignStudentToSection = async (req, res) => {
	try {
		const { studentId, sectionName } = req.body;
		if (!req.user || !req.user._id) {
			return res.status(401).json({ message: "Unauthorized: User not found" });
		}
		const enrolledBy = req.user._id;
		console.log(enrolledBy);
		const newEnrollment = new StudentSection({
			studentId,
			sectionName,
			enrolledBy,
		});
		await newEnrollment.save();
		res.status(201).json({
			message: "Student enrolled successfully",
			enrollment: newEnrollment,
		});
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error enrolling student", error: error.message });
	}
};

export const getStudentsInSection = async (req, res) => {
	try {
		const { sectionName } = req.params;
		const enrollments = await StudentSection.find({ sectionName }).populate(
			"studentId",
			"name studentNumber"
		);
		res.status(200).json({ enrollments });
	} catch (error) {
		res.status(500).json({
			message: "Error fetching students in section",
			error: error.message,
		});
	}
};

export const getAllAssignedSchedule = async (_unused, res) => {
	try {
		const schedules = await ClassSchedule.find()
			.populate("sectionId")
			.populate("subjectId")
			.populate("teacherId", "first_name last_name username")
			.lean();

		// For each schedule, get students in the section
		const results = await Promise.all(
			schedules.map(async (schedule) => {
				const studentSections = await StudentSection.find({
					sectionName: schedule.sectionId, // sectionId is a string like "G1 - Genesis"
					status: "active",
				}).select("studentId");

				const studentIds = studentSections.map((ss) => ss.studentId);

				// Populate student user info
				const students = await Student.find({ _id: { $in: studentIds } })
					.populate("userId", "first_name last_name username middle_name phone")
					.lean();

				return { ...schedule, students };
			})
		);

		res.status(200).json({ schedules: results });
	} catch (error) {
		res.status(500).json({
			message: "Error fetching assigned schedules",
			error: error.message,
		});
	}
};
export const getStudentsByClassSchedule = async (req, res) => {
	try {
		// Find all ClassSchedules assigned to this teacher
		const schedules = await ClassSchedule.find({ teacherId: req.user._id })
			.populate("sectionId")
			.populate("teacherId", "first_name last_name username");

		// For each schedule, get students in the section
		const results = await Promise.all(
			schedules.map(async (schedule) => {
				const studentSections = await StudentSection.find({
					sectionId: schedule.sectionId._id,
					status: "active",
				}).select("studentId");

				const studentIds = studentSections.map((ss) => ss.studentId);

				// Get Student records and populate user info
				const students = await Student.find({ _id: { $in: studentIds } })
					.populate("userId", "first_name last_name username middle_name phone")
					.lean();

				return {
					scheduleId: schedule._id,
					section: schedule.sectionId,
					subject: schedule.subjectId,
					students,
					teacher: schedule.teacherId,
				};
			})
		);

		res.status(200).json({ assignedSchedules: results });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching students", error: error.message });
	}
};
// studentId: {
// 			type: Schema.Types.ObjectId,
// 			ref: "Student",
// 			required: true,
// 		},
// 		sectionId: {
// 			type: Schema.Types.ObjectId,
// 			ref: "Section",
// 			required: true,
// 		},
// 		enrollmentDate: {
// 			type: Date,
// 			required: true,
// 			default: Date.now,
// 		},
// 		enrolledBy: {
// 			type: Schema.Types.ObjectId,
// 			ref: "User",
// 		},
// 		status: {
// 			type: String,
// 			enum: ["active", "dropped", "completed"],
// 			default: "active",
// 		},
