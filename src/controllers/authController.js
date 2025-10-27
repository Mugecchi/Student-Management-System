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
		const {
			username,
			profilePic,
			first_name,
			middle_name,
			last_name,
			userType,
			password,
			userId, // optional — only admins can set this
		} = req.body;

		// Determine which user to update
		const isAdmin = req.user.userType === "admin";
		const targetUserId = userId && isAdmin ? userId : req.user._id;

		// If admin tries to edit another user but userId is missing
		if (userId && !isAdmin) {
			return res
				.status(403)
				.json({ message: "Forbidden: only admins can edit other users." });
		}

		const updateFields = {};

		// Handle profilePic upload
		if (profilePic) {
			if (!profilePic.startsWith("http")) {
				const uploadResponse = await cloudinary.uploader.upload(profilePic);
				updateFields.profilePic = uploadResponse.secure_url;
			} else {
				updateFields.profilePic = profilePic;
			}
		}
		if (username) updateFields.username = username;

		if (first_name) updateFields.first_name = first_name;

		if (middle_name) updateFields.middle_name = middle_name;
		if (last_name) updateFields.last_name = last_name;

		// Only admins can change userType
		if (userType && isAdmin) updateFields.userType = userType;

		if (password) {
			if (password.length < 6) {
				return res
					.status(400)
					.json({ message: "Password must be at least 6 characters long." });
			}
			const salt = await bcrypt.genSalt(10);
			updateFields.password = await bcrypt.hash(password, salt);
		}

		if (Object.keys(updateFields).length === 0) {
			return res.status(400).json({ message: "No fields to update." });
		}

		const updatedUser = await User.findByIdAndUpdate(
			targetUserId,
			updateFields,
			{
				new: true,
				select: "-password", // exclude password from response
			}
		);

		if (!updatedUser) {
			return res.status(404).json({ message: "User not found." });
		}

		res.status(200).json({
			message: "User updated successfully.",
			user: updatedUser,
		});
	} catch (error) {
		console.error("Error in updateProfile:", error);
		res
			.status(500)
			.json({ message: "Internal Server Error", error: error.message });
	}
};

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select("-password");
		res.status(200).json({ users });
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Internal Server Error", error });
	}
};

export const deactivateUser = async (req, res) => {
	try {
		const { userId } = req.params;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		user.isActive = !user.isActive;
		await user.save();

		res.status(200).json({
			message: `User ${
				user.isActive ? "activated" : "deactivated"
			} successfully`,
			user,
		});
	} catch (error) {
		console.error("Error deactivating user:", error);
		res.status(500).json({ message: "Internal Server Error", error });
	}
};
