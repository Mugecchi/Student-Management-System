import mongoose from "mongoose";

const Schema = mongoose.Schema;
// Student Schema
const studentSchema = new mongoose.Schema(
	// Student #	Name  (Last Name, First Name, Middle Name)	Age	Status	Birthdate mm/dd/yyyy	Father's Name	Contact #	Mother's Maiden Name	Contact #	Guardian	Contact #	Address
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			unique: true,
		},
		studentNumber: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		dateOfBirth: { type: Date, required: true },
		address: { type: String, required: true },

		motherName: { type: String, default: "N/A" },
		motherContact: { type: String },
		fatherName: { type: String, default: "N/A" },
		fatherContact: { type: String, default: "N/A" },
		guardianName: { type: String, default: "" },
		guardianContact: { type: String },

		yearLevel: {
			type: Number,
			min: 1,
			max: 12,
		},
	},
	{
		timestamps: true,
	}
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
