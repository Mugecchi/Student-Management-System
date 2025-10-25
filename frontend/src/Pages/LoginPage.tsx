import LoginForm from "@/Components/LoginForm";
import RunningBorder from "@/Components/ui/RunningBorder";
import { useAuth } from "@/hooks/AuthContext";
import { Navigate } from "react-router";
const LoginPage = () => {
	const { user } = useAuth();

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="relative w-full max-w-6xl md:h-[800px] h-[750px]">
			<RunningBorder>
				<div className="flex w-full flex-col md:flex-row">
					<div className="md:w-1/2 p-8 flex flex-col items-center justify-center md:border-r border-slate-600/30">
						<LoginForm />
					</div>

					<div className=" md:w-1/2 md:flex items-center flex-col text-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
						<h2 className="text-2xl font-semibold leading-tight">
							Student Management System
						</h2>

						<p className="text-sm text-slate-200/90">
							A centralized web app to streamline student records, attendance,
							grades, and communication — built for administrators and
							educators.
						</p>

						<ul className="space-y-3">
							<li className="flex items-start gap-3">
								<span className="mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400">
									✓
								</span>
								<span className="text-sm text-slate-200">
									Student profiles & academic history
								</span>
							</li>
							<li className="flex items-start gap-3">
								<span className="mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 text-amber-400">
									✓
								</span>
								<span className="text-sm text-slate-200">
									Attendance tracking & reporting
								</span>
							</li>
							<li className="flex items-start gap-3">
								<span className="mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-500/20 text-sky-400">
									✓
								</span>
								<span className="text-sm text-slate-200">
									Gradebook & performance analytics
								</span>
							</li>
						</ul>
					</div>
				</div>
			</RunningBorder>
		</div>
	);
};

export default LoginPage;
