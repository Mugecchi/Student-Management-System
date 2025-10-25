import { Outlet, useLocation } from "react-router";
import { useAuth } from "./hooks/AuthContext";
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const App = () => {
	const { user } = useAuth();
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
	const location = useLocation();

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, []);

	return (
		<div className="h-screen bg-slate-900 relative flex overflow-hidden">
			{/* MOUSE FOLLOWER */}
			<div
				className="absolute w-96 h-96 rounded-full bg-purple-500 opacity-10 blur-[100px] pointer-events-none transition-all duration-1000 ease-out"
				style={{
					left: `${mousePos.x}px`,
					top: `${mousePos.y}px`,
					transform: "translate(-50%, -50%)",
					zIndex: 100,
				}}
			/>

			{/* SIDEBAR */}
			{user && <Sidebar />}

			{/* MAIN CONTENT AREA */}
			<div className="flex-1 relative flex flex-col">
				{/* HEADER */}
				{user && <Header user={{ ...user, fullName: user.fullName || "" }} />}

				{/* DECORATORS - GRID BG & GLOW SHAPES */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none z-0" />
				<div className="absolute top-0 -left-4 size-96 bg-pink-500 opacity-20 blur-[100px] animate-pulse-slow z-0" />
				<div className="absolute bottom-0 -right-4 size-96 bg-cyan-500 opacity-20 blur-[100px] animate-pulse z-0" />

				<motion.div
					key={location.pathname}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{
						duration: 0.3,
						ease: "easeInOut",
					}}
					className="w-full h-full flex items-center justify-center overflow-auto"
				>
					{/* MAIN PAGE CONTENT */}
					<main className="flex-1 flex h-full relative p-4 justify-center items-center ">
						<AnimatePresence mode="wait" initial={false}>
							<Outlet />
						</AnimatePresence>
					</main>
				</motion.div>
			</div>
		</div>
	);
};

export default App;
