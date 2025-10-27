import mongoose, { Schema } from "mongoose";

// Class Schedule Schema (Links sections, subjects, and teachers)
const classScheduleSchema = new mongoose.Schema(
	{
		sectionId: {
			type: String,
			required: true,
		},
		subjectId: {
			type: Schema.Types.ObjectId,
			ref: "Subject",
			required: true,
		},
		teacherId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		room: String,
		schedule: [
			{
				startTime: String,
				endTime: String,
			},
		],
		assignedBy: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

// Compound index for unique section-subject combination
classScheduleSchema.index({ sectionId: 1, subjectId: 1 }, { unique: true });

const ClassSchedule = mongoose.model("ClassSchedule", classScheduleSchema);

export default ClassSchedule;
