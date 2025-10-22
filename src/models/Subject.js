import mongoose, { Schema } from "mongoose";

// Subject Schema
const subjectSchema = new mongoose.Schema(
	{
		subjectCode: {
			type: String,
			required: true,
			unique: true,
			uppercase: true,
			trim: true,
		},
		subjectName: {
			type: String,
			required: true,
			trim: true,
		},
		description: String,
		units: {
			type: Number,
			required: true,
			min: 1,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

const Subject = mongoose.model("Subject", subjectSchema);
export default Subject;
