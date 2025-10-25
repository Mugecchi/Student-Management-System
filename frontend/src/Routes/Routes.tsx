import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "@/App";
import Dashboard from "@/Pages/Dashboard";
import LoginPage from "@/Pages/LoginPage";
import Layout from "@/Components/Layout";
import Students from "@/Pages/Students";
import {
	BookAlertIcon,
	CalendarIcon,
	ChartBarIcon,
	CogIcon,
	HomeIcon,
	School2Icon,
	UserCircle,
	UserCog2Icon,
	Users,
} from "lucide-react";
import ErrorBoundary from "@/Components/ui/ErrorBoundary";
import Settings from "@/Pages/Settings";
import Teachers from "@/Pages/Teachers";
import UsersPage from "@/Pages/UsersPage";
import SubjectsPage from "@/Pages/SubjectsPage";
import GradePage from "@/Pages/GradePage";

export const menuItems = [
	{ path: "dashboard", icon: HomeIcon, label: "Dashboard" },
	{
		path: "students",
		icon: UserCircle,
		label: "Students",
		allowedRoles: ["admin", "registrar", "teacher"],
	},
	{
		icon: School2Icon,
		label: "Teachers & Subjects",
		children: [
			{ path: "subjects", label: "Subjects", icon: BookAlertIcon },
			{ path: "teachers", label: "Teachers", icon: UserCog2Icon },
		],
	},
	{ path: "schedule", icon: CalendarIcon, label: "Schedule" },
	{ path: "grades", icon: ChartBarIcon, label: "Grades" },
	{ path: "settings", icon: CogIcon, label: "Settings" },
	{ path: "users", icon: Users, label: "Users" },
];
export const router = createBrowserRouter([
	{
		element: <App />,
		path: "/",
		errorElement: <ErrorBoundary />,
		children: [
			{
				element: <LoginPage />,
				path: "login",
			},
			{
				element: (
					<Layout allowedRoles={["student"]}>
						<Dashboard />
					</Layout>
				),
				path: "dashboard",
			},
			{
				element: (
					<Layout allowedRoles={["admin", "registrar", "teacher"]}>
						<Students />
					</Layout>
				),
				path: "students",
			},
			{
				element: (
					<Layout>
						<Settings />
					</Layout>
				),
				path: "settings",
			},
			{
				element: (
					<Layout>
						<Teachers />
					</Layout>
				),
				path: "schedule",
			},
			{
				element: (
					<Layout>
						<SubjectsPage />
					</Layout>
				),
				path: "subjects",
			},
			{
				element: (
					<Layout>
						<UsersPage />
					</Layout>
				),
				path: "users",
			},
			{
				element: (
					<Layout>
						<GradePage />
					</Layout>
				),
				path: "grades",
			},
			{
				element: <Navigate to="/login" replace />,
				path: "/",
			},
		],
	},
]);
