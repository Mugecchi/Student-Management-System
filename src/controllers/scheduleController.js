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
		const schedules = await ClassSchedule.find()
			.populate({
				path: "teacherId",
				model: "User",
				select: "name userType",
				match: { userType: "teacher" },
			})
			.populate("sectionId", "name")
			.populate("subjectId", "subjectName");
		res.json(schedules);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Error fetching schedules", error: err.message });
	}
};

export const getTeachers = async (req, res) => {
	try {
		const teachers = await User.find({ userType: "teacher" });
		res.status(200).json({ success: true, teachers });
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching teachers", error: error.message });
	}
};
