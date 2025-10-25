import { useAuth } from "@/hooks/AuthContext";
import { useToast } from "@/hooks/ToastContext";
import { EyeClosed, EyeIcon } from "lucide-react";
import React from "react";

const LoginForm = () => {
	const [showPassword, setShowPassword] = React.useState(false);
	const [form, setForm] = React.useState({
		username: "",
		password: "",
	});
	const [error, setError] = React.useState("");
	const { login, loading } = useAuth();
	const toast = useToast();

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (error) setError("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Basic validation
		if (!form.username || !form.password) {
			setError("Please fill in all fields");
			return;
		}
		try {
			await login(form);
			toast?.open({
				message: "Logged in successfully!",
				type: "success",
			});
			// Handle successful login (e.g., redirect)
		} catch (error) {
			toast?.open({
				message: `${error}`,
				type: "error",
			});
		}
	};
	return (
		<div className="w-1000 max-w-md">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold text-slate-200 mb-2">Welcome Back</h2>
				<p className="text-slate-400">Login to access to your account</p>
			</div>
			<form className="space-y-6" onSubmit={handleSubmit}>
				{error && (
					<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
						{error}
					</div>
				)}
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
					<label className="auth-input-label">Password</label>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							className="input pr-10"
							onChange={handleChange}
							name="password"
							value={form.password}
							disabled={loading}
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
							disabled={loading}
						>
							{showPassword ? <EyeClosed /> : <EyeIcon />}
						</button>
					</div>
				</div>
				<button
					className="btn disabled:opacity-50 disabled:cursor-not-allowed"
					type="submit"
					disabled={loading}
				>
					{loading ? "Logging in..." : "Login"}
				</button>
			</form>
		</div>
	);
};

export default LoginForm;
