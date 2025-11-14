import { useState } from "react";
import { Link } from "react-router-dom";
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

const MobileSidebar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState<string | null>(null);
	const { logout } = useAuth();
	const { user } = useAuth();
	const handleToggleDropdown = (label: string) => {
		setOpenDropdown((prev) => (prev === label ? null : label));
	};

	return (
		<>
			{/* Hamburger Button */}
			<button
				className="fixed top-4 left-4 z-50 p-2 bg-primary rounded-md md:hidden"
				onClick={() => setIsOpen(true)}
			>
				<ChartBarStacked className="w-6 h-6 text-white" />
			</button>

			{/* Sidebar Drawer */}
			<AnimatePresence>
				{isOpen && (
					<motion.aside
						initial={{ x: "-100%", opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: "-100%", opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="fixed top-0 left-0 z-40 w-64 h-full bg-slate-900 text-white flex flex-col shadow-lg md:hidden"
					>
						{/* Header */}
						<div className="flex items-center justify-between p-4 border-b border-primary">
							<h2 className="font-semibold text-xl block">
								Cauayan Messiah Christian School
							</h2>
							<button
								onClick={() => setIsOpen(false)}
								className="p-2 hover:bg-primary rounded-lg transition-colors"
							>
								<XCircleIcon className="w-6 h-6" />
							</button>
						</div>

						{/* Navigation */}
						<nav className="mt-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
							{menuItems.map((item) => {
								const Icon = item.icon;
								const hasChildren = Array.isArray(item.children);

								if (hasChildren) {
									const isDropdownOpen = openDropdown === item.label;
									return (
										<div key={item.label}>
											<button
												onClick={() => handleToggleDropdown(item.label)}
												className={`${
													item.allowedRoles?.includes(user?.userType as string)
														? "hidden"
														: "block"
												}`}
											>
												<div className="flex items-center">
													<Icon className="w-6 h-6 shrink-0" />
													<span className="ml-3 block">{item.label}</span>
												</div>
												<span>
													{isDropdownOpen ? (
														<ChevronDown className="w-4 h-4" />
													) : (
														<ChevronRight className="w-4 h-4" />
													)}
												</span>
											</button>
											<AnimatePresence initial={false}>
												{isDropdownOpen && (
													<motion.div
														initial={{ height: 0, opacity: 0 }}
														animate={{ height: "auto", opacity: 1 }}
														exit={{ height: 0, opacity: 0 }}
														transition={{ duration: 0.2 }}
														className="overflow-hidden ml-10 mt-1 flex flex-col"
													>
														{item.children &&
															item.children.map((child: any) => {
																const ChildIcon = child.icon || XCircleIcon;
																return (
																	<Link
																		key={String(child.path)}
																		to={String(child.path ?? "")}
																		className={`flex items-center px-4 py-3 hover:bg-primary/30 transition-colors $ {
																			isChildActive ? "bg-primary/40 border-l-4 border-accent" : "border-l-4 border-transparent"
																		}`}
																	>
																		<ChildIcon className="w-6 h-6 shrink-0" />
																		<span className="ml-3 block">
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
										className={`flex items-center px-4 py-3 hover:bg-primary/30 transition-colors $ {
											isActive ? "bg-primary/40 border-l-4 border-accent" : "border-l-4 border-transparent"
										}
										$ {
											!item.allowedRoles || item.allowedRoles.includes(user?.userType as string) ? "block" : "hidden"
										}`}
									>
										<Icon className="w-6 h-6 shrink-0" />
										<span className="ml-3 block">{item.label}</span>
									</Link>
								);
							})}
						</nav>

						{/* Logout */}
						<div className="w-full p-2 mt-auto">
							<button
								className="w-full rounded-full"
								onClick={() => {
									setIsOpen(false);
									logout?.();
								}}
							>
								<RunningBorder>
									<div className="p-2 w-full flex justify-center text-center items-center hover:backdrop-sepia-50">
										Logout
									</div>
								</RunningBorder>
							</button>
						</div>
					</motion.aside>
				)}
			</AnimatePresence>
		</>
	);
};

export default MobileSidebar;
