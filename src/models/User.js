import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},

		first_name: { type: String, required: true },
		middle_name: { type: String, default: "" },
		last_name: {
			type: String,
			required: true,
		},
		phone: {
			type: String, // Changed to String for phone numbers
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		userType: {
			type: String,
			enum: ["student", "teacher", "admin", "registrar"],
			default: "student",
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		profilePic: {
			type: String,
			default: "",
		},
		last_login: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;
