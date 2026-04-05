import RootLayout from "@/components/layout/RootLayout";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { useAuthStore } from "@/store/authStore";
import {
	Outlet,
	createRootRoute,
	createRoute,
	createRouter,
	redirect,
} from "@tanstack/react-router";

// Placeholder — replaced with real pages
const ComingSoon = () => (
	<div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
		Coming soon
	</div>
);

// Protected layout
function ProtectedLayout() {
	const { user, isLoading } = useAuthStore();

	if (isLoading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
			</div>
		);
	}

	if (!user) {
		throw redirect({ to: "/login" });
	}

	return <Outlet />;
}

// Root
const rootRoute = createRootRoute({
	component: RootLayout,
});

// Public routes
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

const campgroundsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/campgrounds",
	component: ComingSoon,
});

// Protected subtree
// All routes nested under this share the auth gate.
const protectedLayout = createRoute({
	getParentRoute: () => rootRoute,
	id: "protected",
	component: ProtectedLayout,
});

const dashboardRoute = createRoute({
	getParentRoute: () => protectedLayout,
	path: "/dashboard",
	component: ComingSoon,
});

// Route tree
const routeTree = rootRoute.addChildren([
	homeRoute,
	loginRoute,
	registerRoute,
	campgroundsRoute,
	protectedLayout.addChildren([dashboardRoute]),
]);

export const router = createRouter({ routeTree });

// Register router type globally for full type-safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
