import LoginForm from "@/Components/LoginForm";
import RunningBorder from "@/Components/ui/RunningBorder";
import { useAuth } from "@/hooks/AuthContext";
import { Navigate } from "react-router";
import logo from "@/assets/logo.png";
const LoginPage = () => {
	const { user } = useAuth();

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	return (
		<div className="relative w-full  md:max-w-2xl  md:h-[800px] h-100">
			<RunningBorder>
				<div className="flex w-full flex-col justify-center items-center">
					<img className="h-20 w-20 mb-6" src={logo} alt="Logo" />
					<LoginForm />
				</div>
			</RunningBorder>
		</div>
	);
};

export default LoginPage;
