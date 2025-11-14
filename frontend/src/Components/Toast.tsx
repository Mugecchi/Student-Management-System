import { ToastContext } from "@/hooks/ToastContext";
import React from "react";

interface ToastProperties {
	message: string;
	type?: "success" | "error" | "info";
	close: () => void;
}

const getToastClass = (type?: string) => {
	switch (type) {
		case "success":
			return "bg-gradient-to-r from-emerald-500 to-slate-800 text-white";

		case "error":
			return "bg-gradient-to-r from-red-500 to-slate-800 text-white";
		case "info":
			return "bg-gradient-to-r from-blue-500 to-slate-800 text-white";
		default:
			return "bg-gray-500 text-white";
	}
};

export function Toast({ message, type, close }: ToastProperties) {
	return (
		<div
			className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg flex items-center space-x-4 ${getToastClass(
				type
			)}`}
			style={{ zIndex: 9999 }}
		>
			<span>{message}</span>
			<button
				onClick={close}
				className="ml-2 text-white hover:text-gray-200 focus:outline-none"
			>
				&times;
			</button>
		</div>
	);
}

interface ToastProviderProps {
	children: React.ReactNode;
}

interface ToastType {
	id: number;
	message: string;
	type?: "success" | "error" | "info";
}

export function ToastProvider({ children }: ToastProviderProps) {
	const [toasts, setToasts] = React.useState<ToastType[]>([]);

	function openToast({
		message,
		type,
	}: {
		message: string;
		type?: "success" | "error" | "info";
	}) {
		const id = Date.now();
		setToasts((prev) => [...prev, { id, message, type }]);

		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 3000);
	}

	function closeToast(id: number) {
		return () => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		};
	}

	const contextValue = React.useMemo(
		() => ({
			open: openToast,
			close: closeToast,
		}),
		[]
	);

	return (
		<ToastContext.Provider value={contextValue}>
			{children}
			{toasts.map((toast) => (
				<Toast
					key={toast.id}
					message={toast.message}
					type={toast.type}
					close={closeToast(toast.id)}
				/>
			))}
		</ToastContext.Provider>
	);
}
