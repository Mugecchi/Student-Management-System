import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./Routes/Routes.tsx";
import { AuthProvider } from "./hooks/AuthContext.tsx";
import { ToastProvider } from "./Components/Toast.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ToastProvider>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</ToastProvider>
	</StrictMode>
);
