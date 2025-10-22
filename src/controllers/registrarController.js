import User from "../models/User.js";
import Student from "../models/Student.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
import AcademicYear from "../models/AcademicYear.js";
import Subject from "../models/Subject.js";
const generateStudentNumber = async () => {
	const year = new Date().getFullYear();
	const prefix = `${String(year).slice(-2)}-`;

	const latestStudent = await User.findOne({
		username: { $regex: `^${prefix}` },
		userType: "student",
	}).sort({ username: -1 });

	let sequence = 1;
	if (latestStudent) {
		const lastSequence = parseInt(latestStudent.username.split("-").pop());
		sequence = lastSequence + 1;
	}

	return `${prefix}${String(sequence).padStart(5, "0")}`;
};

export const studentEnrollment = async (req, res) => {
	const {
		studentNumber,
		first_name,
		middle_name,
		last_name,
		dateOfBirth,
		motherName,
		motherContact,
		fatherName,
		fatherContact,
		guardianName,
		address,
		guardianContact,
		yearLevel,
	} = req.body;

	try {
		const studentId = await generateStudentNumber();
		const existingUser = await User.findOne({ studentId });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}
		const hashedPassword = await bcrypt.hash(dateOfBirth, 10);
		const newUser = new User({
			username: studentId,
			first_name,
			middle_name,
			last_name,
			phone: guardianContact,
			password: hashedPassword,
			userType: "student",
			isActive: true,
		});
		await newUser.save();

		const student = new Student({
			userId: newUser._id,
			studentNumber,
			dateOfBirth,
			address,
			yearLevel,
			motherName,
			motherContact,
			fatherName,
			fatherContact,
			guardianName,
			guardianContact,
		});
		await student.save();
		res
			.status(201)
			.json({ message: "Student enrolled successfully", user: studentId });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Error enrolling student", error: error.message });
	}
};

export const getAllStudents = async (req, res) => {
	try {
		const { page = 1, limit = 10, search = "" } = req.query;
		let query = {};

		// optional search by name, username, or phone (case-insensitive)
		if (search.trim() !== "") {
			const matchingUsers = await User.find({
				$or: [
					{ first_name: { $regex: search, $options: "i" } },
					{ last_name: { $regex: search, $options: "i" } },
					{ username: { $regex: search, $options: "i" } },
					{ phone: { $regex: search, $options: "i" } },
				],
			}).select("_id");
			const userIds = matchingUsers.map((u) => u._id);
			query.userId = { $in: userIds };
		}

		const total = await Student.countDocuments(query);

		const students = await Student.find(query)
			.populate("userId", "_id first_name last_name username middle_name phone")
			.skip((page - 1) * limit)
			.limit(Number(limit))
			.sort({ createdAt: -1 })
			.lean();

		// Flatten and include both studentId and userId
		const flattened = students.map((s) => ({
			_id: s._id, // Student’s own ID
			userId: s.userId?._id || null, // Associated user ID
			studentNumber: s.studentNumber,
			dateOfBirth: s.dateOfBirth,
			address: s.address,
			motherName: s.motherName,
			motherContact: s.motherContact,
			fatherName: s.fatherName,
			fatherContact: s.fatherContact,
			guardianName: s.guardianName,
			guardianContact: s.guardianContact,
			yearLevel: s.yearLevel,
			createdAt: s.createdAt,
			updatedAt: s.updatedAt,
			first_name: s.userId?.first_name,
			middle_name: s.userId?.middle_name,
			last_name: s.userId?.last_name,
			username: s.userId?.username,
			phone: s.userId?.phone,
		}));

		res.status(200).json({
			page: Number(page),
			limit: Number(limit),
			total,
			totalPages: Math.ceil(total / limit),
			students: flattened,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Error fetching students",
			error: error.message,
		});
	}
};

export const getStudentById = async (req, res) => {
	const { id } = req.params;
	try {
		// First check if the ID is a valid MongoDB ObjectId
		if (!id.match(/^[0-9a-fA-F]{24}$/)) {
			return res.status(400).json({ message: "Invalid student ID format" });
		}

		const student = await Student.findById(id).populate(
			"userId",

			"first_name last_name username middle_name phone"
		);

		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}

		// Flatten the structure
		const { userId, ...studentData } = student.toObject();
		const flattened = {
			...studentData,
			...(userId || {}),
		};

		res.status(200).json({ student: flattened });
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: "Error fetching student",
			error: error.message,
		});
	}
};
export const deleteStudent = async (req, res) => {
	const { id } = req.params; // This is the student._id

	try {
		// Find the student document first
		const student = await Student.findById(id);

		if (!student) {
			return res.status(404).json({ message: "Student not found" });
		}

		// Delete the associated User by the userId field
		if (student.userId) {
			await User.findByIdAndDelete(student.userId);
		}

		// Then delete the student itself
		await Student.findByIdAndDelete(id);

		res.status(200).json({
			message: "Student and associated user deleted successfully",
			deletedStudentId: id,
			deletedUserId: student.userId,
		});
	} catch (error) {
		console.error("Error deleting student:", error);
		res.status(500).json({
			message: "Error deleting student",
			error: error.message,
		});
	}
};

export const addAcademicYear = async (req, res) => {
	const { semester, startDate, endDate } = req.body;

	try {
		// ✅ 1. Validate start and end dates
		if (
			new Date(startDate).toDateString() === new Date(endDate).toDateString()
		) {
			return res.status(400).json({
				message: "Start date and end date cannot be the same.",
			});
		}

		if (new Date(endDate) < new Date(startDate)) {
			return res.status(400).json({
				message: "End date cannot be earlier than start date.",
			});
		}

		// ✅ 2. Check if a record with the same start, end, and semester already exists
		const existing = await AcademicYear.findOne({
			startDate: new Date(startDate),
			endDate: new Date(endDate),
			semester,
		});
		if (existing) {
			return res.status(400).json({
				message: "This academic year and semester already exist.",
			});
		}

		// ✅ 3. Create new academic year (isCurrent defaults to true)
		const newAcademicYear = new AcademicYear({
			semester,
			startDate,
			endDate,
		});

		await newAcademicYear.save();

		// ✅ 4. Return success response
		res.status(201).json({
			message: "Academic year added successfully",
			academicYear: newAcademicYear,
		});
	} catch (error) {
		console.error("Error adding academic year:", error);

		// ✅ 5. Handle unique constraint violations
		if (error.code === 11000) {
			return res.status(400).json({
				message: "Duplicate academic year entry.",
			});
		}

		res.status(500).json({
			message: "Error adding academic year",
			error: error.message,
		});
	}
};

export const getAcademicYears = async (req, res) => {
	try {
		const academicYears = await AcademicYear.find().sort({ createdAt: -1 });
		res.status(200).json({ academicYears });
	} catch (error) {
		console.error("Error fetching academic years:", error);
		res
			.status(500)
			.json({ message: "Error fetching academic years", error: error.message });
	}
};

export const addSubject = async (req, res) => {
	try {
		const { subjectCode, subjectName, description, units } = req.body;
		const existingSubject = await Subject.findOne({ subjectCode, subjectName });
		if (existingSubject) {
			return res.status(400).json({ message: "Subject already exists" });
		}

		const newSubject = new Subject({
			subjectCode,
			subjectName,
			description,
			units,
		});

		await newSubject.save();
		res
			.status(201)
			.json({ message: "Subject added successfully", subject: newSubject });
	} catch (error) {
		console.error("Error adding subject:", error);
		res
			.status(500)
			.json({ message: "Error adding subject", error: error.message });
	}
};

export const getAllSubjects = async (req, res) => {
	try {
		const subjects = await Subject.find().sort({ createdAt: -1 });
		res.status(200).json({ subjects });
	} catch (error) {
		console.error("Error fetching subjects:", error);
		res
			.status(500)
			.json({ message: "Error fetching subjects", error: error.message });
	}
};
