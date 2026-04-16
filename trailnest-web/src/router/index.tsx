import RootLayout from "@/components/layout/RootLayout";
import Home from "@/pages/Home";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ResetPassword from "@/pages/auth/ResetPassword";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import CampgroundDetail from "@/pages/campgrounds/CampgroundDetail";
import CampgroundList from "@/pages/campgrounds/CampgroundList";
import CreateCampground from "@/pages/campgrounds/CreateCampground";
import EditCampground from "@/pages/campgrounds/EditCampground";
import MyCampgrounds from "@/pages/campgrounds/MyCampgrounds";
import { useAuthStore } from "@/store/authStore";
import {
	Outlet,
	createRootRoute,
	createRoute,
	createRouter,
	redirect,
} from "@tanstack/react-router";

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

const rootRoute = createRootRoute({ component: RootLayout });

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

const forgotPasswordRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/forgot-password",
	component: ForgotPassword,
});

const resetPasswordRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/reset-password/$token",
	component: ResetPassword,
});

const verifyEmailRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/verify-email/$token",
	component: VerifyEmail,
});

const campgroundsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/campgrounds",
	component: CampgroundList,
});

const campgroundDetailRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/campgrounds/$slug",
	component: CampgroundDetail,
});

const protectedLayout = createRoute({
	getParentRoute: () => rootRoute,
	id: "protected",
	component: ProtectedLayout,
});

const createCampgroundRoute = createRoute({
	getParentRoute: () => protectedLayout,
	path: "/campgrounds/new",
	component: CreateCampground,
});

const editCampgroundRoute = createRoute({
	getParentRoute: () => protectedLayout,
	path: "/campgrounds/$slug/edit",
	component: EditCampground,
});

const myCampgroundsRoute = createRoute({
	getParentRoute: () => protectedLayout,
	path: "/my-campgrounds",
	component: MyCampgrounds,
});

const routeTree = rootRoute.addChildren([
	homeRoute,
	loginRoute,
	registerRoute,
	forgotPasswordRoute,
	resetPasswordRoute,
	verifyEmailRoute,
	campgroundsRoute,
	campgroundDetailRoute,
	protectedLayout.addChildren([
		createCampgroundRoute,
		editCampgroundRoute,
		myCampgroundsRoute,
	]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
