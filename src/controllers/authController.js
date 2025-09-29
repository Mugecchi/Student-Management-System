import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs/dist/bcrypt.js";
export const signup = async (req, res) => {
	const { email, phone, first_name, last_name, password, username } = req.body;

	try {
		const requiredFields = {
			email,
			phone,
			first_name,
			last_name,
			password,
			username,
		};
		const missingFields = Object.entries(requiredFields)
			.filter(([_, value]) => !value)
			.map(([key]) => key);

		if (missingFields.length > 0) {
			return res.status(400).json({
				message: `Missing required fields: ${missingFields.join(", ")}`,
			});
		}
		// Email format check
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ message: "Invalid email format" });
		}

		if (password.length < 6) {
			return res
				.status(400)
				.json({ message: "Password must be at least 6 characters" });
		}
		const user = await User.findOne({ email });
		if (user) return res.status(400).json({ message: "User Already Exists" });
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({
			email,
			phone,
			first_name,
			last_name,
			username,
			password: hashedPassword,
		});
		if (newUser) {
			generateToken(newUser.id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser.id,
				email: newUser.email,
				phone: newUser.phone,
				username: newUser.username,
				first_name: newUser.first_name,
				last_name: newUser.last_name,
				profile_pic: newUser.profilePic,
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
