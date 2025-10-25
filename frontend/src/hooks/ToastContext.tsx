import { createContext, useContext } from "react";

interface ToastContextType {
	open: (options: {
		message: string;
		type?: "success" | "error" | "info";
	}) => void;
	close: (id: number) => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => useContext(ToastContext);
