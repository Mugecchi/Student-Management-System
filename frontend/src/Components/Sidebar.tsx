import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
	ChartBarStacked,
	XCircleIcon,
	ChevronDown,
	ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/AuthContext";
import RunningBorder from "./ui/RunningBorder";
import { menuItems } from "@/Routes/Routes";

const Sidebar = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const location = useLocation();
	const { logout } = useAuth();

	const handleToggleDropdown = (label: string) => {
		setOpenDropdown((prev) => (prev === label ? null : label));
	};
	const { user } = useAuth();

	return (
		<aside
			className={`text-white h-screen transition-all duration-300 flex flex-col bg-slate-900 ${
				isCollapsed ? "w-20" : "w-64"
			}`}
		>
			{/* Header */}
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-primary">
				<h2 className={`font-bold text-xl ${isCollapsed ? "hidden" : "block"}`}>
					Student Portal
				</h2>
				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="p-2 hover:bg-primary rounded-lg transition-colors"
				>
					{isCollapsed ? (
						<ChartBarStacked className="w-6 h-6" />
					) : (
						<XCircleIcon className="w-6 h-6" />
					)}
				</button>
			</div>

			{/* Navigation */}
			<nav className="mt-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
				{menuItems.map((item) => {
					const Icon = item.icon;
					const hasChildren = Array.isArray(item.children);
					const isChildActive = hasChildren
						? item.children?.some((child) =>
								location.pathname.includes(child.path)
						  )
						: false;
					const isActive = item.path
						? location.pathname.includes(item.path)
						: isChildActive;

					// If item has dropdown
					if (hasChildren) {
						const isOpen = openDropdown === item.label;
						return (
							<div
								key={item.label}
								className={`
							 ${item.allowedRoles?.includes(user?.userType as string) ? "hidden" : "block"}`}
							>
								<button
									onClick={() => handleToggleDropdown(item.label)}
									className={`flex items-center justify-between w-full px-5 py-3 cursor-pointer hover:bg-primary/30 transition-colors ${
										isActive ? "bg-primary/40 " : ""
									}
									`}
								>
									<div className="flex items-center">
										<Icon className="w-6 h-6 shrink-0" />
										<span
											className={`ml-3 
												${!isCollapsed ? "block" : "hidden"}
`}
										>
											{item.label}
										</span>
									</div>
									{!isCollapsed && (
										<span>
											{isOpen ? (
												<ChevronDown className="w-4 h-4" />
											) : (
												<ChevronRight className="w-4 h-4" />
											)}
										</span>
									)}
								</button>

								{/* Dropdown Animation */}
								<AnimatePresence initial={false}>
									{isOpen && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.2 }}
											className={`overflow-hidden ${
												!isCollapsed ? "ml-10 mt-1" : ""
											}  flex flex-col `}
										>
											{item.children &&
												item.children.map((child) => {
													const isChildActive = location.pathname.includes(
														child.path
													);
													const ChildIcon = child.icon || XCircleIcon;
													return (
														<Link
															key={child.path}
															to={child.path}
															className={`flex items-center px-4 py-3 hover:bg-primary/30 transition-colors ${
																isChildActive
																	? "bg-primary/40 border-l-4 border-accent"
																	: "border-l-4 border-transparent"
															}`}
														>
															<ChildIcon className="w-6 h-6 shrink-0" />
															<span
																className={`ml-3 ${
																	isCollapsed ? "hidden" : "block"
																}`}
															>
																{child.label}
															</span>
														</Link>
													);
												})}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						);
					}

					// Single menu item
					return (
						<Link
							key={item.path}
							to={item.path ?? ""}
							className={`flex items-center px-4 py-3 hover:bg-primary/30 transition-colors ${
								isActive
									? "bg-primary/40 border-l-4 border-accent"
									: "border-l-4 border-transparent"
							}
							${
								!item.allowedRoles ||
								item.allowedRoles.includes(user?.userType as string)
									? "block"
									: "hidden"
							}
`}
						>
							<Icon className="w-6 h-6 shrink-0" />
							<span
								className={`ml-3 transition-opacity duration-300 ${
									isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
								}`}
							>
								{item.label}
							</span>
						</Link>
					);
				})}
			</nav>

			{/* Logout */}
			<div className="w-full p-2 mt-auto">
				<button className="w-full rounded-full" onClick={() => logout?.()}>
					<RunningBorder>
						<div className="p-2 w-full flex justify-center text-center items-center hover:backdrop-sepia-50">
							Logout
						</div>
					</RunningBorder>
				</button>
			</div>
		</aside>
	);
};

export default Sidebar;
