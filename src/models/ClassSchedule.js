import mongoose from "mongoose";

// Class Schedule Schema (Links sections, subjects, and teachers)
const classScheduleSchema = new mongoose.Schema(
	{
		sectionId: {
			type: Schema.Types.ObjectId,
			ref: "Section",
			required: true,
		},
		subjectId: {
			type: Schema.Types.ObjectId,
			ref: "Subject",
			required: true,
		},
		teacherId: {
			type: Schema.Types.ObjectId,
			ref: "Teacher",
			required: true,
		},
		room: String,
		schedule: [
			{
				dayOfWeek: {
					type: String,
					enum: [
						"Monday",
						"Tuesday",
						"Wednesday",
						"Thursday",
						"Friday",
						"Saturday",
						"Sunday",
					],
				},
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
