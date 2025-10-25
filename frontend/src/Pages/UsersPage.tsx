import React, { useState } from "react";
import {
	Search,
	Plus,
	Edit2,
	Trash2,
	X,
	Phone,
	Calendar,
	Clock,
} from "lucide-react";
import { api } from "@/lib/axios";
import GridCard, { Grid } from "@/Components/ui/GridCard";
import type { AxiosError } from "axios";
import { useToast } from "@/hooks/ToastContext";

interface UserData {
	userId: string;
	_id: string;
	username: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	phone: string;
	password: string;
	userType: "admin" | "user" | "moderator";
	isActive: boolean;
	profilePic: string;
	last_login: string;
	createdAt: string;
	updatedAt: string;
}

interface FormData {
	username: string;
	first_name: string;
	middle_name: string;
	last_name: string;
	phone: string;
	password: string;
	userType: "admin" | "user" | "moderator";
	isActive: boolean;
	profilePic: string;
}

export default function UsersPage() {
	const [users, setUsers] = useState<UserData[]>([]);

	const [searchTerm, setSearchTerm] = useState("");
	const [filterUserType, setFilterUserType] = useState<string>("All");
	const [filterStatus, setFilterStatus] = useState<string>("All");
	const [showModal, setShowModal] = useState(false);
	const [modalMode, setModalMode] = useState<"add" | "edit">("add");
	const [currentUser, setCurrentUser] = useState<UserData | null>(null);
	const [formData, setFormData] = useState<FormData>({
		username: "",
		first_name: "",
		middle_name: "",
		last_name: "",
		phone: "",
		password: "",
		userType: "user",
		isActive: true,
		profilePic: "",
	});
	const toast = useToast();

	const userTypes = ["All", "admin", "teacher", "registrar", "student"];
	const statuses = ["All", "Active", "Inactive"];

	React.useEffect(() => {
		const fetchUsers = async () => {
			api
				.get("/auth/get-all-users")
				.then((response) => {
					setUsers(response.data.users);
				})
				.catch((error) => {
					console.error("Error fetching users:", error);
				});
		};
		fetchUsers();
	}, []);
	const filteredUsers = users.filter((user) => {
		const fullName =
			`${user.first_name} ${user.middle_name} ${user.last_name}`.toLowerCase();
		const matchesSearch =
			fullName.includes(searchTerm.toLowerCase()) ||
			user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.phone.includes(searchTerm);
		const matchesUserType =
			filterUserType === "All" || user.userType === filterUserType;
		const matchesStatus =
			filterStatus === "All" ||
			(filterStatus === "Active" && user.isActive) ||
			(filterStatus === "Inactive" && !user.isActive);
		return matchesSearch && matchesUserType && matchesStatus;
	});

	const openAddModal = () => {
		setModalMode("add");
		setFormData({
			username: "",
			first_name: "",
			middle_name: "",
			last_name: "",
			phone: "",
			password: "",
			userType: "user",
			isActive: true,
			profilePic: "",
		});
		setShowModal(true);
	};

	const openEditModal = (user: UserData) => {
		setModalMode("edit");
		setCurrentUser(user);
		setFormData({
			username: user.username,
			first_name: user.first_name,
			middle_name: user.middle_name,
			last_name: user.last_name,
			phone: user.phone,
			password: "",
			userType: user.userType,
			isActive: user.isActive,
			profilePic: user.profilePic,
		});
		setShowModal(true);
	};

	const handleSubmit = async () => {
		// 1️⃣ Validate required fields
		if (
			!formData.username ||
			!formData.first_name ||
			!formData.last_name ||
			!formData.phone
		) {
			alert("Please fill in all required fields");
			return;
		}

		// 2️⃣ For adding new users, password is required
		if (modalMode === "add" && !formData.password) {
			alert("Password is required for new users");
			return;
		}

		try {
			if (modalMode === "add") {
				// Create new user
				const newUser: UserData = {
                    ...formData,
                    _id: "",
                    last_login: "",
                    createdAt: "",
                    updatedAt: "",
                    userId: ""
                };
				setUsers([...users, newUser]);

				await api.post("/auth/signup", newUser);
				toast?.open({
					message: "User added successfully",
					type: "success",
				});
			} else if (currentUser) {
				// Prepare update payload
				const updatedUser: Partial<UserData> = {
					...formData,
					userId: currentUser._id, // explicitly numberl backend which user to update
				};

				// Remove empty password field so backend won’t overwrite it
				if (!formData.password) {
					delete updatedUser.password;
				}

				// Send update to backend
				const res = await api.put("/auth/update-profile", updatedUser);

				// Update local users state only for the edited user
				setUsers(
					users.map((u) => (u._id === currentUser._id ? res.data.user : u))
				);

				toast?.open({
					message: "User updated successfully",
					type: "success",
				});
			}

			setShowModal(false);
		} catch (error) {
			const err = error as AxiosError<{ message?: string }>;
			toast?.open({
				message: err.response?.data?.message || "An error occurred",
				type: "error",
			});
		}
	};

	const handleDelete = (id: string) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			setUsers(users.filter((u) => u._id !== id));
		}
	};

	const toggleUserStatus = async (id: string) => {
		try {
			// Optimistic UI update
			setUsers((prevUsers) =>
				prevUsers.map((u) =>
					u._id === id
						? {
								...u,
								isActive: !u.isActive,
								updatedAt: new Date().toISOString(),
						  }
						: u
				)
			);

			// Send toggle request to backend (note the `id` in the URL)
			await api.post(`/auth/deactivate-user/${id}`);

			toast?.open({
				message: "User status updated successfully",
				type: "success",
			});
		} catch (error) {
			console.error("Error toggling user status:", error);

			// Revert optimistic update if backend fails
			setUsers((prevUsers) =>
				prevUsers.map((u) =>
					u._id === id
						? {
								...u,
								isActive: !u.isActive,
								updatedAt: new Date().toISOString(),
						  }
						: u
				)
			);

			toast?.open({
				message: "Failed to update user status",
				type: "error",
			});
		}
	};

	const handleInputChange = (
		field: keyof FormData,
		value: string | boolean
	) => {
		setFormData({
			...formData,
			[field]: value,
		});
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getInitials = (firstName: string, lastName: string) => {
		return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
	};

	const getUserTypeColor = (type: string) => {
		switch (type) {
			case "admin":
				return "bg-purple-100 text-purple-700";
			case "teacher":
				return "bg-blue-100 text-blue-700";
			default:
				return "bg-slate-100 text-slate-700";
		}
	};
	return (
		<Grid>
			<GridCard>
				<div className="flex w-full">
					<div className="w-full">
						<div className="mb-8">
							<h1 className="text-4xl font-bold text-white mb-2">
								User Management
							</h1>
							<p className="text-slate-600">
								Manage system users and their permissions
							</p>
						</div>

						<div className=" rounded-xl shadow-sm border border-slate-200 mb-6 p-6">
							<div className="flex flex-col md:flex-row gap-4 mb-4">
								<div className="flex-1 relative">
									<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
									<input
										type="text"
										placeholder="Search by name, username or phone..."
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								</div>

								<select
									value={filterUserType}
									onChange={(e) => setFilterUserType(e.target.value)}
									className="px-4 py-2.5 border bg-slate-950  border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
								>
									{userTypes.map((type) => (
										<option key={type} value={type} className="text-left">
											{type === "All"
												? "All Types"
												: type.charAt(0).toUpperCase() + type.slice(1)}
										</option>
									))}
								</select>

								<select
									value={filterStatus}
									onChange={(e) => setFilterStatus(e.target.value)}
									className="px-4 py-2.5 border bg-slate-950 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`"
								>
									{statuses.map((status) => (
										<option
											key={status}
											value={status}
											className="bg-slate-900 text-white hover:bg-accent cursor-pointer"
										>
											{status}
										</option>
									))}
								</select>

								<button
									onClick={openAddModal}
									className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
								>
									<Plus className="w-5 h-5" />
									Add User
								</button>
							</div>

							<div className="text-sm text-slate-600">
								Showing {filteredUsers.length} of {users.length} users
							</div>
						</div>

						<div className="grid gap-4">
							{filteredUsers.map((user) => (
								<div
									key={user._id}
									className=" rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
								>
									<div className="flex items-start justify-between">
										<div className="flex-1">
											<div className="flex items-center gap-3 mb-3">
												<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
													{getInitials(user.first_name, user.last_name)}
												</div>
												<div>
													<h3 className="text-lg  font-semibold text-white text-semibold">
														{user.first_name} {user.middle_name}{" "}
														{user.last_name}
													</h3>
													<div className="flex items-center gap-2 flex-wrap">
														<span className="text-sm text-slate-600">
															@{user.username}
														</span>
														<span className="text-slate-300">•</span>
														<span
															className={`text-xs px-2.5 py-1 rounded-full font-medium ${getUserTypeColor(
																user.userType
															)}`}
														>
															{user.userType.charAt(0).toUpperCase() +
																user.userType.slice(1)}
														</span>
														<span
															className={`text-xs px-2.5 py-1 rounded-full font-medium ${
																user.isActive
																	? "bg-green-100 text-green-700"
																	: "bg-red-100 text-red-700"
															}`}
														>
															{user.isActive ? "Active" : "Inactive"}
														</span>
													</div>
												</div>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												<div className="flex items-center gap-2 text-sm text-slate-600">
													<Phone className="w-4 h-4 text-slate-400" />
													<span>{user.phone}</span>
												</div>
												<div className="flex items-center gap-2 text-sm text-slate-600">
													<Clock className="w-4 h-4 text-slate-400" />
													<span>Last login: {formatDate(user.last_login)}</span>
												</div>
												<div className="flex items-center gap-2 text-sm text-slate-600">
													<Calendar className="w-4 h-4 text-slate-400" />
													<span>Joined: {formatDate(user.createdAt)}</span>
												</div>
											</div>
										</div>

										<div className="flex gap-2 ml-4">
											<button
												onClick={() => toggleUserStatus(user._id)}
												className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
													user.isActive
														? "bg-orange-50 text-orange-700 hover:bg-orange-100"
														: "bg-green-50 text-green-700 hover:bg-green-100"
												}`}
											>
												{user.isActive ? "Deactivate" : "Activate"}
											</button>
											<button
												onClick={() => openEditModal(user)}
												className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
												title="Edit user"
											>
												<Edit2 className="w-5 h-5" />
											</button>
											<button
												onClick={() => handleDelete(user._id)}
												className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
												title="Delete user"
											>
												<Trash2 className="w-5 h-5" />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>

						{filteredUsers.length === 0 && (
							<div className="text-center py-12 rounded-xl shadow-sm border">
								<p className="text-slate-600 text-lg">
									No users found matching your criteria
								</p>
							</div>
						)}
					</div>

					{showModal && (
						<div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
							<div className=" rounded-xl bg-slate-950 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
								<div className="flex items-center justify-between p-6 border-b">
									<h2 className="text-2xl font-bold text-slate-800">
										{modalMode === "add" ? "Add New User" : "Edit User"}
									</h2>
									<button
										onClick={() => setShowModal(false)}
										className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
									>
										<X className="w-6 h-6 text-slate-600" />
									</button>
								</div>

								<div className="p-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="block text-sm font-medium text-slate-700 mb-2">
												Username *
											</label>
											<input
												type="text"
												value={formData.username}
												onChange={(e) =>
													handleInputChange("username", e.target.value)
												}
												className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-slate-700 mb-2">
												Phone *
											</label>
											<input
												type="number"
												value={formData.phone}
												onChange={(e) =>
													handleInputChange("phone", e.target.value)
												}
												className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-slate-700 mb-2">
												First Name *
											</label>
											<input
												type="text"
												value={formData.first_name}
												onChange={(e) =>
													handleInputChange("first_name", e.target.value)
												}
												className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-slate-700 mb-2">
												Middle Name
											</label>
											<input
												type="text"
												value={formData.middle_name}
												onChange={(e) =>
													handleInputChange("middle_name", e.target.value)
												}
												className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-slate-700 mb-2">
												Last Name *
											</label>
											<input
												type="text"
												value={formData.last_name}
												onChange={(e) =>
													handleInputChange("last_name", e.target.value)
												}
												className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-slate-700 mb-2">
												User Type *
											</label>
											<select
												value={formData.userType}
												onChange={(e) =>
													handleInputChange(
														"userType",
														e.target.value as "admin" | "teacher" | "registrar"
													)
												}
												className="w-full focus:bg-slate-800 px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
											>
												<option value="admin">Admin</option>
												<option value="registrar">Registrar</option>
												<option value="teacher">Teacher</option>
												<option value="student">Student</option>
											</select>
										</div>

										<div className="md:col-span-2">
											<label className="block text-sm font-medium text-slate-700 mb-2">
												{modalMode === "add"
													? "Password *"
													: "New Password (leave blank to keep current)"}
											</label>
											<input
												type="password"
												value={formData.password}
												onChange={(e) =>
													handleInputChange("password", e.target.value)
												}
												className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
												placeholder={
													modalMode === "edit"
														? "Leave blank to keep current password"
														: ""
												}
											/>
										</div>

										<div className="md:col-span-2">
											<label className="flex items-center gap-2 cursor-pointer">
												<input
													type="checkbox"
													checked={formData.isActive}
													onChange={(e) =>
														handleInputChange("isActive", e.target.checked)
													}
													className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
												/>
												<span className="text-sm font-medium text-slate-700">
													Active User
												</span>
											</label>
										</div>
									</div>

									<div className="flex gap-3 mt-6">
										<button
											onClick={() => setShowModal(false)}
											className="flex-1 px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
										>
											Cancel
										</button>
										<button
											onClick={handleSubmit}
											className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
										>
											{modalMode === "add" ? "Add User" : "Save Changes"}
										</button>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</GridCard>
		</Grid>
	);
}
