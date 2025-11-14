/* eslint-disable react-refresh/only-export-components */
import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { api } from "@/lib/axios";
import type { AuthContextType, User } from "@/types/enrollment";
import type { AxiosError } from "axios";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	// Check authentication on mount
	useEffect(() => {
		checkAuth();
	}, []);

	const checkAuth = async () => {
		try {
			setLoading(true);
			const res = await api.get("/auth/check"); // your Express route should return user data
			setUser(res.data);
		} catch (err) {
			setUser(null);
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const login = async (data: { username: string; password: string }) => {
		try {
			setLoading(true);
			const res = await api.post("/auth/login", data);
			setUser(res.data); // backend returns user info
		} catch (err) {
			const error = err as AxiosError<{ message?: string }>;

			throw new Error(error.response?.data?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};
	const signup = async (data: {
		username: string;
		first_name: string;
		middle_name: string;
		last_name: string;
		phone: string;
		password: string;
		role: string;
	}) => {
		try {
			setLoading(true);
			const res = await api.post("/auth/signup", data);
			setUser(res.data); // backend returns user info
		} catch (err) {
			const error = err as AxiosError<{ message?: string }>;
			throw new Error(error.response?.data?.message || "Signup failed");
		} finally {
			setLoading(false);
		}
	};

	const refresh = () => setRefreshTrigger((prev) => prev + 1);
	const logout = async () => {
		try {
			await api.post("/auth/logout"); // backend clears cookie
			setUser(null);
		} catch {
			// ignore
		}
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				logout,
				checkAuth,
				signup,
				refresh,
				refreshTrigger,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook for easier usage
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
