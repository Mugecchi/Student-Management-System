import Grade from "../models/Grade.js";

// Assign or update a grade for a student
export const assignGrade = async (req, res) => {
	try {
		const {
			studentId,
			scheduleId,
			prelimGrade,
			midtermGrade,
			finalsGrade,
			finalGrade,
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
				prelimGrade,
				midtermGrade,
				finalsGrade,
				finalGrade,
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
			});
		res.status(200).json(grades);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching grades", error: error.message });
	}
};
