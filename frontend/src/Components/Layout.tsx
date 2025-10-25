import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/AuthContext";

interface Props {
	children?: React.ReactNode;
	allowedRoles?: string[]; // e.g. ["admin", "teacher"]
}

const Layout = ({ children, allowedRoles }: Props) => {
	const { user } = useAuth();

	// If not logged in
	if (!user) {
		return <Navigate to="/login" replace />;
	}

	// If allowedRoles is specified and user’s role isn’t included
	if (
		user.userType !== "admin" &&
		allowedRoles &&
		!allowedRoles.includes(user.userType as string)
	) {
		return <Navigate to="/unauthorized" replace />;
	}

	return <>{children}</>;
};

export default Layout;
