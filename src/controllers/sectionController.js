import Section from "../models/Section.js";
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
		const { studentId, sectionId } = req.body;
		const enrolledBy = req.user._id;
		const newEnrollment = new StudentSection({
			studentId,
			sectionId,
			enrolledBy,
		});
		await newEnrollment.save();
		res
			.status(201)
			.json({
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
		const { sectionId } = req.params;
		const enrollments = await StudentSection.find({ sectionId }).populate(
			"studentId",
			"name studentNumber"
		);
		res.status(200).json({ enrollments });
	} catch (error) {
		res
			.status(500)
			.json({
				message: "Error fetching students in section",
				error: error.message,
			});
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
