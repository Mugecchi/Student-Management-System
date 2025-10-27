import ClassSchedule from "../models/ClassSchedule.js";
import User from "../models/User.js";

// Add a schedule for a teacher
export const addTeacherSchedule = async (req, res) => {
	try {
		const { sectionId, subjectId, teacherId, room, schedule, assignedBy } =
			req.body;

		// Validate required fields
		if (!sectionId || !subjectId || !teacherId || !schedule) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		// Create new schedule
		const newSchedule = new ClassSchedule({
			sectionId,
			subjectId,
			teacherId,
			room,
			schedule,
			assignedBy,
		});

		await newSchedule.save();
		res
			.status(201)
			.json({ message: "Schedule added successfully", schedule: newSchedule });
	} catch (error) {
		if (error.code === 11000) {
			return res.status(409).json({
				message: "Schedule for this section and subject already exists.",
			});
		}
		res
			.status(500)
			.json({ message: "Error adding schedule", error: error.message });
	}
};

export const getAllSchedules = async (req, res) => {
	try {
		const userId = req.user._id;
		const userType = req.user.userType;

		let query = {};

		// Only allow teachers to get their own schedules
		if (userType === "teacher") {
			query.teacherId = userId;
		}

		const schedules = await ClassSchedule.find(query)
			.populate({
				path: "teacherId",
				model: "User",
				select: "first_name last_name username userType",
				match: { userType: "teacher" },
			})
			.populate("sectionId", "name")
			.populate("subjectId", "subjectName")
			.lean();

		// For each schedule, fetch assigned students in the section
		const StudentSection = (await import("../models/StudentSection.js"))
			.default;
		const Student = (await import("../models/Student.js")).default;
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

				return { ...schedule, students };
			})
		);

		res.json(results);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching schedules", error: err.message });
	}
};

export const getTeachers = async (_unused, res) => {
	try {
		const teachers = await User.find({ userType: "teacher" });
		res.status(200).json({ success: true, teachers });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching teachers", error: error.message });
	}
};
