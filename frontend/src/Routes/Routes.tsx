import { createBrowserRouter, Navigate, type Path } from "react-router-dom";
import App from "@/App";
import Dashboard from "@/Pages/Dashboard";
import LoginPage from "@/Pages/LoginPage";
import Layout from "@/Components/Layout";
import Students from "@/Pages/Students";
import {
	Book,
	CalendarIcon,
	ChartBarIcon,
	GitFork,
	HomeIcon,
	UserCircle,
	Users,
	type LucideProps,
} from "lucide-react";
import ErrorBoundary from "@/Components/ui/ErrorBoundary";
import UsersPage from "@/Pages/UsersPage";
import SubjectsPage from "@/Pages/SubjectsPage";
import GradePage from "@/Pages/GradePage";
import type {
	ForwardRefExoticComponent,
	RefAttributes,
	ReactElement,
	JSXElementConstructor,
	ReactNode,
	ReactPortal,
} from "react";
import type { JSX } from "react/jsx-runtime";
import Schedule from "@/Pages/Schedule";
import Guidance from "@/Pages/Guidance";

interface menuItemsType {
	path?: string;
	label: string;
	allowedRoles?: string[];
	children?: {
		map(
			arg0: (child: {
				path: string | number | bigint | Partial<Path> | null | undefined;
				icon: ForwardRefExoticComponent<
					Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
				>;
				label:
					| string
					| number
					| bigint
					| boolean
					| ReactElement<unknown, string | JSXElementConstructor<unknown>>
					| Iterable<ReactNode>
					| ReactPortal
					| Promise<
							| string
							| number
							| bigint
							| boolean
							| ReactPortal
							| ReactElement<unknown, string | JSXElementConstructor<unknown>>
							| Iterable<ReactNode>
							| null
							| undefined
					  >
					| null
					| undefined;
			}) => JSX.Element
		):
			| import("react").ReactNode
			| import("motion-dom").MotionValue<number>
			| import("motion-dom").MotionValue<string>;
		path: string;
	};
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const menuItems: menuItemsType[] = [
	{ path: "dashboard", icon: HomeIcon, label: "Dashboard" },
	{
		path: "students",
		icon: UserCircle,
		label: "Students",
		allowedRoles: ["registrar", "admin", "teacher"],
	},
	{
		icon: Book,
		path: "subjects",
		label: "Subjects",
		allowedRoles: ["registrar", "admin", "teacher"],
	},
	{
		path: "schedule",
		icon: CalendarIcon,
		label: "Schedule",
		allowedRoles: ["registrar", "admin", "teacher"],
	},
	{
		path: "grades",
		icon: ChartBarIcon,
		label: "Grades",
		allowedRoles: ["registrar", "admin", "teacher"],
	},
	{
		path: "guidance",
		icon: GitFork,
		label: "Guidance",
		allowedRoles: ["registrar", "admin", "teacher"],
	},
	{
		path: "users",
		icon: Users,
		label: "Users",
		allowedRoles: ["registrar", "admin"],
	},
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
					<Layout>
						<Dashboard />
					</Layout>
				),
				path: "dashboard",
			},
			{
				element: (
					<Layout allowedRoles={["registrar", "admin", "Teacher"]}>
						<Students />
					</Layout>
				),
				path: "students",
			},

			{
				element: (
					<Layout allowedRoles={["registrar", "admin", "Teacher"]}>
						<Schedule />
					</Layout>
				),
				path: "schedule",
			},
			{
				element: (
					<Layout allowedRoles={["registrar", "admin", "Teacher"]}>
						<SubjectsPage />
					</Layout>
				),
				path: "subjects",
			},
			{
				element: (
					<Layout allowedRoles={["registrar", "admin", "Teacher"]}>
						<UsersPage />
					</Layout>
				),
				path: "users",
			},
			{
				element: (
					<Layout allowedRoles={["registrar", "admin", "Teacher"]}>
						<GradePage />
					</Layout>
				),
				path: "grades",
			},
			{
				element: (
					<Layout allowedRoles={["registrar", "admin", "Teacher"]}>
						<Guidance />
					</Layout>
				),
				path: "guidance",
			},
			{
				element: <Navigate to="/login" replace />,
				path: "/",
			},
		],
	},
]);
