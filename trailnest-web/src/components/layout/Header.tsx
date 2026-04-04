import { apiClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, Tent, User } from "lucide-react";
import { toast } from "sonner";

export default function Header() {
	const { user, clearAuth } = useAuthStore();
	const navigate = useNavigate();

	async function handleLogout() {
		try {
			await apiClient.post("/auth/logout");
		} finally {
			clearAuth();
			navigate({ to: "/" });
			toast.success("Logged out");
		}
	}

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
				{/* Brand */}
				<Link to="/" className="flex items-center gap-2.5 shrink-0">
					<div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
						<Tent
							className="w-4.5 h-4.5 text-primary-foreground"
							strokeWidth={2}
						/>
					</div>
					<span className="font-semibold text-lg tracking-tight text-foreground">
						Trail<span className="text-primary">Nest</span>
					</span>
				</Link>

				{/* Center nav */}
				<nav className="hidden md:flex items-center gap-1">
					<Button
						variant="ghost"
						size="sm"
						className="text-muted-foreground hover:text-foreground"
						asChild
					>
						<Link to="/campgrounds">Explore</Link>
					</Button>
				</nav>

				{/* Right side */}
				<div className="flex items-center gap-2">
					{user ? (
						<>
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-foreground gap-2"
								asChild
							>
								<Link to="/dashboard">
									<div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
										<User className="w-3.5 h-3.5 text-primary" />
									</div>
									<span className="hidden sm:inline">
										{user.displayName ?? user.username}
									</span>
								</Link>
							</Button>
							<Separator orientation="vertical" className="h-4" />
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-foreground"
								onClick={handleLogout}
							>
								<LogOut className="w-4 h-4" />
								<span className="hidden sm:inline">Logout</span>
							</Button>
						</>
					) : (
						<>
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-foreground"
								asChild
							>
								<Link to="/login">Log in</Link>
							</Button>
							<Button size="sm" className="shadow-sm" asChild>
								<Link to="/register">Get started</Link>
							</Button>
						</>
					)}

					{/* Mobile menu placeholder */}
					<Button variant="ghost" size="icon" className="md:hidden">
						<Menu className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</header>
	);
}
