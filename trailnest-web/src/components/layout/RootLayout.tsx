import { Toaster } from "@/components/ui/sonner";
import { Outlet } from "@tanstack/react-router";
import Header from "./Header";

export default function RootLayout() {
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
