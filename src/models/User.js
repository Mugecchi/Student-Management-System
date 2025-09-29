import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		phone: {
			type: String, // Changed to String for phone numbers
			required: true,
			unique: true,
			validate: {
				validator: function (v) {
					return /^\+?[0-9]{7,15}$/.test(v); // Basic phone number validation
				},
				message: (props) => `${props.value} is not a valid phone number!`,
			},
		},
		first_name: { type: String, required: true },
		last_name: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		profilePic: {
			type: String,
			default: "",
		},
	},
	{
		timestamps: true,
	}
);

const User = mongoose.model("User", userSchema);

export default User;
