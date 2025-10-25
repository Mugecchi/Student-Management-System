import LoginForm from "@/Components/LoginForm";
import RunningBorder from "@/Components/ui/RunningBorder";
import { useAuth } from "@/hooks/AuthContext";
import { Navigate } from "react-router";
import SignupForm from "@/Components/SignupForm";
import { motion as m } from "framer-motion";
import React from "react";

const LoginPage = () => {
	const { user } = useAuth();
	const [loginMode, setLoginMode] = React.useState(true);

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="relative w-full max-w-6xl md:h-[800px] h-[750px]">
			<RunningBorder>
				<div className="flex w-full flex-col md:flex-row">
					<div className="md:w-1/2 p-8 flex flex-col items-center justify-center md:border-r border-slate-600/30">
						<m.div
							key={loginMode ? "login" : "signup"}
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: -20, opacity: 0 }}
							transition={{
								duration: 0.3,
								type: "spring",
								stiffness: 300,
								damping: 30,
							}}
						>
							{loginMode ? <LoginForm /> : <SignupForm />}
						</m.div>
						<div className="w-full mt-10 flex	justify-center">
							<button
								onClick={() => setLoginMode(!loginMode)}
								className="text-sm text-slate-400 hover:text-white transition-colors  flex md:w-50"
							>
								<div className="flex items-center gap-2 w-full">
									<RunningBorder>
										<div
											className="relative w-full h-10 rounded-full overflow-hidden cursor-pointer flex items-center"
											onClick={() => setLoginMode(!loginMode)}
										>
											<m.div
												className="w-1/2 absolute top-0 bottom-0 rounded-1/2"
												style={{
													background:
														"linear-gradient(135deg, oklch(71.5% 0.143 215.221), oklch(61.5% 0.143 215.221))",
												}}
												initial={{ left: loginMode ? "0%" : "50%" }}
												animate={{ left: loginMode ? "0%" : "50%" }}
												transition={{
													duration: 0.3,
													type: "spring",
													stiffness: 300,
												}}
											/>
											<div className="absolute inset-0 w-full items-center grid grid-cols-2 gap-0 justify-around text-sm font-medium">
												<m.span
													animate={{
														color: loginMode ? "var(--color-white)" : "#94a3b8",
														filter: loginMode
															? "drop-shadow(0 0 10px rgba(125, 158, 221,0.8))"
															: "drop-shadow(0 0 0px rgba(125, 158, 221,0))",
													}}
													transition={{
														duration: 0.3,
														type: "spring",
														stiffness: 300,
													}}
												>
													Login
												</m.span>
												<m.span
													animate={{
														color: !loginMode
															? "var(--color-white)"
															: "#94a3b8",
														filter: !loginMode
															? "drop-shadow(0 0 10px rgba(125, 158, 221,0.8))"
															: "drop-shadow(0 0 0px rgba(125, 158, 221,0))",
													}}
													transition={{
														duration: 0.3,
														type: "spring",
														stiffness: 300,
													}}
												>
													Signup
												</m.span>
											</div>
										</div>
									</RunningBorder>
								</div>
							</button>
						</div>
					</div>

					<div className=" md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent"></div>
				</div>
			</RunningBorder>
		</div>
	);
};

export default LoginPage;
