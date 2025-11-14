import { useAuth } from "@/hooks/AuthContext";
import React from "react";

const regForm = [
	"username",
	"first_name",
	"middle_name",
	"last_name",
	"phone",
	"password",
	"role",
];

const SignupForm = () => {
	const { loading, signup } = useAuth();

	const [form, setForm] = React.useState({
		username: "",
		first_name: "",
		middle_name: "",
		last_name: "",
		phone: "",
		password: "",
		role: "",
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		signup(form);
	};
	console.log(regForm);
	return (
		<div className="w-full max-w-md">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold text-slate-200 mb-2">
					Welcome to Student Information Management System
				</h2>
			</div>
			<form className="space-y-6" onSubmit={handleSubmit}>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="auth-input-label">Username</label>
						<input
							type="text"
							className="input"
							name="username"
							value={form.username}
							onChange={handleChange}
							disabled={loading}
							required
						/>
					</div>
					<div>
						<label className="auth-input-label">First Name</label>
						<input
							type="text"
							className="input"
							name="first_name"
							value={form.first_name}
							onChange={handleChange}
							disabled={loading}
							required
						/>
					</div>
					<div>
						<label className="auth-input-label">Middle Name</label>
						<input
							type="text"
							className="input"
							name="middle_name"
							value={form.middle_name}
							onChange={handleChange}
							disabled={loading}
						/>
					</div>
					<div>
						<label className="auth-input-label">Last Name</label>
						<input
							type="text"
							className="input"
							name="last_name"
							value={form.last_name}
							onChange={handleChange}
							disabled={loading}
							required
						/>
					</div>
					<div>
						<label className="auth-input-label">Phone</label>
						<input
							type="number"
							className="input"
							name="phone"
							value={form.phone}
							onChange={handleChange}
							disabled={loading}
							required
						/>
					</div>
					<div>
						<label className="auth-input-label">Password</label>
						<input
							type="password"
							className="input"
							name="password"
							value={form.password}
							onChange={handleChange}
							disabled={loading}
							required
						/>
					</div>
					<div className="col-span-2">
						<label className="auth-input-label">Role</label>
						<select
							className="input"
							name="role"
							value={form.role}
							onChange={handleChange}
							disabled={loading}
							required
						>
							<option value="">Select Role</option>
							<option value="student">Student</option>
							<option value="teacher">Teacher</option>
						</select>
					</div>
				</div>
				<button
					className="btn disabled:opacity-50 disabled:cursor-not-allowed w-full"
					type="submit"
					disabled={loading}
				>
					{loading ? "Submitting..." : "Register"}
				</button>
			</form>
		</div>
	);
};

export default SignupForm;
