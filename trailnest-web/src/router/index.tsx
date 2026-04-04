import RootLayout from "@/components/layout/RootLayout";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { useAuthStore } from "@/store/authStore";
import {
	createRootRoute,
	createRoute,
	createRouter,
	redirect,
} from "@tanstack/react-router";

// Placeholder components — replaced with real pages
const ComingSoon = () => (
	<div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
		Coming soon
	</div>
);

// ── Root ────────────────────────────────────────────────────
const rootRoute = createRootRoute({
	component: RootLayout,
});

// ── Public routes ───────────────────────────────────────────
const homeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: Home,
});

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: Login,
});

const registerRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/register",
	component: Register,
});

// ── Protected route helper ──────────────────────────────────
// Usage: beforeLoad: protectedRoute
export const protectedRoute = () => {
	const { user } = useAuthStore.getState();
	if (!user) throw redirect({ to: "/login" });
};

// ── Route tree ──────────────────────────────────────────────
// ── Placeholder routes ─────────────────
const campgroundsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/campgrounds",
	component: ComingSoon,
});

const dashboardRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/dashboard",
	beforeLoad: protectedRoute,
	component: ComingSoon,
});

// ── Route tree ──────────────────────────────────────────────
const routeTree = rootRoute.addChildren([
	homeRoute,
	loginRoute,
	registerRoute,
	campgroundsRoute,
	dashboardRoute,
]);

export const router = createRouter({ routeTree });

// Register router type globally for full type-safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
