import mongoose from "mongoose";
// Grade Schema
const gradeSchema = new mongoose.Schema(
	{
		studentId: {
			type: Schema.Types.ObjectId,
			ref: "Student",
			required: true,
		},
		scheduleId: {
			type: Schema.Types.ObjectId,
			ref: "ClassSchedule",
			required: true,
		},
		prelimGrade: {
			type: Number,
			min: 0,
			max: 100,
		},
		midtermGrade: {
			type: Number,
			min: 0,
			max: 100,
		},
		finalsGrade: {
			type: Number,
			min: 0,
			max: 100,
		},
		finalGrade: {
			type: Number,
			min: 0,
			max: 100,
		},
		remarks: {
			type: String,
			enum: ["Passed", "Failed", "Incomplete", "Dropped"],
			default: "Incomplete",
		},
		enteredBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

// Compound index for unique student-schedule combination
gradeSchema.index({ studentId: 1, scheduleId: 1 }, { unique: true });

// Virtual to calculate final grade
gradeSchema.virtual("calculatedFinalGrade").get(function () {
	if (this.prelimGrade && this.midtermGrade && this.finalsGrade) {
		return (
			(this.prelimGrade + this.midtermGrade + this.finalsGrade) /
			3
		).toFixed(2);
	}
	return null;
});

const Grade = mongoose.model("Grade", gradeSchema);

export default Grade;
