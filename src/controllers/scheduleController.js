import ClassSchedule from "../models/ClassSchedule.js";
import User from "../models/User.js";

// Add a schedule for a teacher
export const addTeacherSchedule = async (req, res) => {
	try {
		const { sectionId, subjectId, teacherId, schedule } = req.body;
		const assignedBy = req.user._id;

		if (!sectionId || !subjectId || !teacherId || !schedule) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		// Robust overlap check for all slots in all schedules
		const conflicts = await ClassSchedule.find({ teacherId });
		const newSlots = Array.isArray(schedule) ? schedule : [schedule];
		let overlapFound = false;
		for (const sch of conflicts) {
			const existingSlots = Array.isArray(sch.schedule)
				? sch.schedule
				: [sch.schedule];
			for (const newSlot of newSlots) {
				for (const slot of existingSlots) {
					if (slot.day !== newSlot.day) continue;
					if (
						newSlot.startTime < slot.endTime &&
						newSlot.endTime > slot.startTime
					) {
						overlapFound = true;
						break;
					}
				}
				if (overlapFound) break;
			}
			if (overlapFound) break;
		}
		if (overlapFound) {
			return res.status(409).json({
				message: "Teacher already has a schedule that overlaps with this time.",
			});
		}

		const newSchedule = new ClassSchedule({
			sectionId,
			subjectId,
			teacherId,
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
				select: "first_name last_name username userType ",
				match: { userType: "teacher" },
			})
			.populate("sectionId", "name")
			.populate("subjectId", "subjectName")
			.lean();

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
