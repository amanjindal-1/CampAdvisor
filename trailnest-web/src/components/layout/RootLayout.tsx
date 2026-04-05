import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/authStore";
import { Outlet } from "@tanstack/react-router";
import axios from "axios";
import { useEffect } from "react";
import Header from "./Header";

export default function RootLayout() {
	const { setAuth, clearAuth } = useAuthStore();

	// Fire-and-forget session restore.
	// Runs once on app load — does NOT block rendering, so public pages
	// appear immediately. Protected routes handle their own loading state
	// via ProtectedLayout.
	useEffect(() => {
		axios
			.post("/api/v1/auth/refresh", {}, { withCredentials: true })
			.then(({ data }) => setAuth(data.data.user, data.data.accessToken))
			.catch(() => clearAuth());
	}, []);

	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1">
				<Outlet />
			</main>
			<Toaster position="bottom-right" richColors />
		</div>
	);
}
