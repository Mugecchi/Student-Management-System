import GuidanceRecords from "../models/GuidanceRecords.js";
import GuidanceSettings from "../models/GuidanceSettings.js";
import User from "../models/User.js";

export const addGuidanceRecord = async (req, res) => {
	try {
		const { guidanceRecord } = req.body;
		const student = req.params.id;
		const counselor = req.user._id;

		if (!guidanceRecord) {
			return res.status(400).json({ message: "guidanceRecord is required" });
		}
		if (!student) {
			return res.status(400).json({ message: "student id is required" });
		}
		const guidanceRecordId = await GuidanceSettings.findById(guidanceRecord);
		if (!guidanceRecordId) {
			return res.status(404).json({ message: "Guidance Setting not found" });
		}
		const studentId = await User.findById(student);
		if (!studentId) {
			return res.status(404).json({ message: "Student not found" });
		}

		const newGuidanceRecord = new GuidanceRecords({
			student: studentId._id,
			counselor,
			guidanceRecord: guidanceRecordId._id,
		});

		const savedRecord = await newGuidanceRecord.save();

		return res.status(201).json({
			message: "Guidance Record added successfully",
			guidanceRecord: savedRecord,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: "Error in addGuidanceRecord", error: error.message });
	}
};

export const getGuidanceRecords = async (_, res) => {
	try {
		const records = await GuidanceRecords.find()
			.populate("student", "name studentId")
			.populate("counselor", "first_name last_name")
			.populate("guidanceRecord");
		res.status(200).json({ success: true, records });
	} catch (error) {
		res.status(500).json({
			message: "Error fetching guidance records",
			error: error.message,
		});
	}
};
export const addGuidanceSetting = async (req, res) => {
	try {
		const { title, description } = req.body;

		if (!title || !description) {
			return res
				.status(400)
				.json({ message: "Title and Description are required" });
		}

		const newGuidanceSetting = new GuidanceSettings({
			title,
			description,
		});

		const savedSetting = await newGuidanceSetting.save();

		return res.status(201).json({
			message: "Guidance setting added successfully",
			guidanceSetting: savedSetting,
		});
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Error in addGuidanceSetting", error: err.message });
	}
};
export const deleteGuidanceSetting = async (req, res) => {
	try {
		const { id } = req.body;
		const deletedSetting = await GuidanceSettings.findByIdAndDelete(id);
		if (!deletedSetting) {
			return res.status(404).json({ message: "Guidance Setting not found" });
		}
		return res
			.status(200)
			.json({ message: "Guidance Setting deleted successfully" });
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Error in deleteGuidanceSetting", error: err.message });
	}
};

export const deleteGuidanceRecord = async (req, res) => {
	try {
		const { id } = req.body;
		const deletedRecord = await GuidanceRecords.findByIdAndDelete(id);
		if (!deletedRecord) {
			return res.status(404).json({ message: "Guidance Record not found" });
		}
		return res
			.status(200)
			.json({ message: "Guidance Record deleted successfully" });
	} catch (err) {
		return res
			.status(500)
			.json({ message: "Error in deleteGuidanceRecord", error: err.message });
	}
};

export const getGuidanceSelection = async (_, res) => {
	try {
		const students = await User.aggregate([
			{ $match: { userType: "student" } },
			{
				$project: {
					fullName: { $concat: ["$first_name", " ", "$last_name"] },
				},
			},
		]);

		const response = await GuidanceSettings.find({}, "-description");
		res.status(200).json({ success: true, settings: response, students });
	} catch (error) {
		res.status(500).json({
			message: "Error fetching guidance settings",
			error: error.message,
		});
		console.log(error);
	}
};
