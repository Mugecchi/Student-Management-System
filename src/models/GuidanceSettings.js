import mongoose from "mongoose";

const guidanceSettingsSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const GuidanceSettings = mongoose.model(
	"GuidanceSettings",
	guidanceSettingsSchema
);

export default GuidanceSettings;
