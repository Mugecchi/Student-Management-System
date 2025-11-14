import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/AuthContext";

interface FloatingElement {
	id: number;
	left: number;
	delay: number;
	duration: number;
	size: number;
}

interface MousePosition {
	x: number;
	y: number;
}

const ErrorBoundary = () => {
	const navigate = useNavigate();
	const [floatingElements, setFloatingElements] = useState<FloatingElement[]>(
		[]
	);
	const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });

	useEffect(() => {
		const elements: FloatingElement[] = Array.from({ length: 15 }, (_, i) => ({
			id: i,
			left: Math.random() * 100,
			delay: Math.random() * 5,
			duration: 3 + Math.random() * 4,
			size: 20 + Math.random() * 40,
		}));
		setFloatingElements(elements);
	}, []);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	const { logout } = useAuth();
	return (
		<div className="h-screen bg-gradient-to-br from-slate-900 to-slate-900 relative flex overflow-hidden">
			{/* Animated background grid */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none z-0 opacity-30" />

			{/* Gradient blobs */}
			<div
				className="absolute top-0 -left-4 size-96 bg-slate-500 opacity-20 blur-[120px] animate-pulse"
				style={{ animationDuration: "4s" }}
			/>
			<div
				className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[120px] animate-pulse"
				style={{ animationDuration: "3s" }}
			/>
			<div
				className="absolute top-1/2 left-1/2 size-96 bg-purple-500 opacity-15 blur-[120px] animate-pulse"
				style={{ animationDuration: "5s" }}
			/>

			{/* Floating particles */}
			{floatingElements.map((el) => (
				<div
					key={el.id}
					className="absolute rounded-full  
 opacity-5"
					style={{
						left: `${el.left}%`,
						width: `${el.size}px`,
						height: `${el.size}px`,
						animation: `float ${el.duration}s ease-in-out infinite`,
						animationDelay: `${el.delay}s`,
					}}
				/>
			))}

			{/* Mouse follower effect */}
			<div
				className="absolute w-96 h-96 rounded-full bg-purple-500 opacity-10 blur-[100px] pointer-events-none transition-all duration-1000 ease-out"
				style={{
					left: `${mousePos.x}px`,
					top: `${mousePos.y}px`,
					transform: "translate(-50%, -50%)",
				}}
			/>

			<div className="flex-1 relative flex flex-col justify-center items-center z-10 px-4">
				{/* Main 404 content */}

				<div className="text-center space-y-8 max-w-2xl">
					<div className="relative">
						<h1 className="text-[12rem] md:text-[16rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-500 via-purple-500 to-cyan-500 leading-none animate-pulse">
							404
						</h1>
						<div className="absolute inset-0 text-[12rem] md:text-[16rem] font-bold text-purple-500 opacity-20 blur-2xl leading-none">
							404
						</div>
					</div>

					<div className="relative h-16">
						<h2 className="text-3xl md:text-5xl font-bold text-white mb-4 relative z-10">
							Oops! Lost in Space
						</h2>
					</div>

					<p className="text-lg md:text-xl text-slate-300 max-w-md mx-auto">
						The page you're looking for has drifted into the digital void. Let's
						get you back on track!
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
						<button
							onClick={() => navigate(-1)}
							className="group relative px-8 py-4 bg-gradient-to-r from-slate-500 to-purple-500 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105"
						>
							<span className="relative z-10">Go Back</span>
							<div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</button>

						<button
							onClick={() => navigate("/")}
							className="group relative px-8 py-4 bg-slate-800/50 backdrop-blur-sm rounded-full font-semibold text-white border-2 border-purple-500/30 overflow-hidden transition-all duration-300 hover:border-purple-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:scale-105"
						>
							<span className="relative z-10">Go Home</span>
						</button>
						<button
							onClick={() => {
								logout();
								navigate("/");
							}}
							className="group relative px-8 py-4 bg-gradient-to-r from-slate-500 to-purple-500 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:scale-105"
						>
							<span className="relative z-10">Logout</span>
							<div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						</button>
					</div>

					<div className="mt-12 relative">
						<div
							className="inline-block animate-bounce"
							style={{ animationDuration: "3s" }}
						>
							<div className="text-8xl opacity-80">🛸</div>
						</div>
					</div>
				</div>
			</div>

			<style>{`
				@keyframes float {
					0%, 100% {
						transform: translateY(0) translateX(0);
					}
					25% {
						transform: translateY(-30px) translateX(10px);
					}
					50% {
						transform: translateY(-60px) translateX(-10px);
					}
					75% {
						transform: translateY(-30px) translateX(5px);
					}
				}
			`}</style>
		</div>
	);
};

export default ErrorBoundary;
