import mongoose, { Schema } from "mongoose";

// Section Schema
const sectionSchema = new mongoose.Schema(
	{
		sectionName: {
			type: String,
			required: true,
			trim: true,
		},
		academicYearId: {
			type: Schema.Types.ObjectId,
			ref: "AcademicYear",
			required: true,
		},
		yearLevel: Number,
		maxCapacity: {
			type: Number,
			default: 40,
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

// Compound index for unique section name per academic year
sectionSchema.index({ sectionName: 1, academicYearId: 1 }, { unique: true });

const Section = mongoose.model("Section", sectionSchema);

export default Section;
