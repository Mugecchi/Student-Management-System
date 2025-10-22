import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";

export const signup = async (req, res) => {
	const {
		username,
		first_name,
		middle_name,
		last_name,
		phone,
		password,
		userType,
	} = req.body;

	try {
		const requiredFields = {
			username,
			first_name,
			middle_name,
			last_name,
			password,
			phone,
		};
		const missingFields = Object.entries(requiredFields)
			.filter(([_, value]) => !value)
			.map(([key]) => key);

		if (missingFields.length > 0) {
			return res.status(400).json({
				message: `Missing required fields: ${missingFields.join(", ")}`,
			});
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters" });
		}
		const user = await User.findOne({
			$or: [{ username }, { phone }],
		});
		if (user) return res.status(400).json({ message: "User Already Exists" });
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			username,
			first_name,
			middle_name,
			last_name,
			phone,
			password: hashedPassword,
			userType: userType || "teacher", // Default to 'Teacher' if userType not specified
		});
		if (newUser) {
			const savedUser = await newUser.save();
			generateToken(savedUser._id, res);

			res.status(201).json({
				_id: savedUser._id,
				username: savedUser.username,
				first_name: savedUser.first_name,
				last_name: savedUser.last_name,
				profile_pic: savedUser.profilePic,
				password: savedUser.password,
			});
		} else {
			res.status(400).json({ message: "Invalid User Data" });
		}
	} catch (err) {
		console.log("Error in signup controller: ", err);
		res.status(500).json({
			message: "Internal server error",
		});
	}
};

export const login = async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
			.status(400)
			.json({ message: "username and password are required" });
	}

	try {
		const user = await User.findOne({ username });
		if (!user) return res.status(400).json({ message: "Invalid credentials" });
		// never tell the client which one is incorrect: password or username

		// Check user status before allowing login
		if (user.status === "suspended") {
			return res.status(403).json({
				message: "Your account has been suspended. Please contact support.",
			});
		}

		if (user.status === "inactive") {
			return res
				.status(403)
				.json({ message: "Your account is inactive. Please contact support." });
		}

		if (user.status === "not-validated") {
			return res.status(403).json({
				message:
					"Please verify your account first. Check your username for verification instructions.",
			});
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);
		if (!isPasswordCorrect)
			return res.status(400).json({ message: "Invalid credentials" });

		// Update last_login
		user.last_login = new Date();
		await user.save();

		generateToken(user._id, res);

		res.status(200).json({
			_id: user._id,
			fullName: `${user.first_name} ${user.last_name}`,
			username: user.username,
			profilePic: user.profilePic,
			userType: user.userType,
			last_login: user.last_login,
			status: user.status,
		});
	} catch (error) {
		console.error("Error in login controller:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const logout = (_, res) => {
	res.cookie("jwt", "", { maxAge: 0 });
	res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
	try {
		const userID = req.user._id;
		const { profilePic, first_name, last_name, password } = req.body;

		const updateFields = {};

		if (profilePic) {
			const uploadResponse = await cloudinary.uploader.upload(profilePic);
			updateFields.profilePic = uploadResponse.secure_url;
		}
		if (first_name) updateFields.first_name = first_name;
		if (last_name) updateFields.last_name = last_name;
		if (password) {
			if (password.length < 6) {
				return res
					.status(400)
					.json({ message: "Password must be at least 6 characters" });
			}
			const salt = await bcrypt.genSalt(10);
			updateFields.password = await bcrypt.hash(password, salt);
		}

		if (Object.keys(updateFields).length === 0) {
			return res.status(400).json({ message: "No fields to update" });
		}

		await User.findByIdAndUpdate(userID, updateFields, { new: true });
		res.status(200).json({ message: "User updated successfully" });
	} catch (error) {
		console.error("Error in update profile", error);
		res.status(500).json({ message: "Internal Server Error", error });
	}
};
