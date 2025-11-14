import mongoose, { Schema } from "mongoose";

const guidanceRecord = new mongoose.Schema(
	{
		student: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		counselor: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		guidanceRecord: {
			type: Schema.Types.ObjectId,
			ref: "GuidanceSettings",
			required: true,
		},
	},
	{ timestamps: true }
);

const GuidanceRecords = mongoose.model("GuidanceRecords", guidanceRecord);
export default GuidanceRecords;
