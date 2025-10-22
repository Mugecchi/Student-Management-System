import mongoose from "mongoose";

const academicYearSchema = new mongoose.Schema(
	{
		semester: {
			type: String,
			required: true,
			enum: ["1st Semester", "2nd Semester", "Summer"],
		},
		isCurrent: { type: Boolean, default: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
	},
	{ timestamps: true }
);

academicYearSchema.index(
	{ startDate: 1, endDate: 1, semester: 1 },
	{ unique: true }
);

academicYearSchema.pre("save", async function (next) {
	if (this.isCurrent) {
		await this.constructor.updateMany(
			{ _id: { $ne: this._id } },
			{ $set: { isCurrent: false } }
		);
	}
	next();
});

const AcademicYear = mongoose.model("AcademicYear", academicYearSchema);
export default AcademicYear;
