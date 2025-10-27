import mongoose, { Schema } from "mongoose";

// Student Section Enrollment Schema
const studentSectionSchema = new mongoose.Schema(
	{
		studentId: {
			type: Schema.Types.ObjectId,
			ref: "Student",
			required: true,
		},
		sectionName: {
			type: String,
			required: true,
		},
		enrollmentDate: {
			type: Date,
			required: true,
			default: Date.now,
		},
		enrolledBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		status: {
			type: String,
			enum: ["active", "dropped", "completed"],
			default: "active",
		},
	},
	{
		timestamps: true,
	}
);

studentSectionSchema.index({ studentId: 1, sectionId: 1 }, { unique: true });

const StudentSection = mongoose.model("StudentSection", studentSectionSchema);
export default StudentSection;
