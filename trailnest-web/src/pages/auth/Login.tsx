import { apiClient } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { Tent } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
	email: z.string().email("Enter a valid email"),
	password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function Login() {
	const navigate = useNavigate();
	const { setAuth } = useAuthStore();
	const form = useForm<FormData>({ resolver: zodResolver(schema) });

	async function onSubmit(values: FormData) {
		try {
			const { data } = await apiClient.post("/auth/login", values);
			setAuth(data.data.user, data.data.accessToken);
			toast.success("Welcome back!");
			navigate({ to: "/" });
		} catch (err: unknown) {
			toast.error(
				(err as { response?: { data?: { message?: string } } })?.response?.data
					?.message ?? "Login failed",
			);
		}
	}

	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-muted/30">
			<div className="w-full max-w-sm">
				{/* Brand mark */}
				<div className="flex flex-col items-center mb-8">
					<div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-primary mb-4 shadow-lg shadow-primary/25">
						<Tent className="w-6 h-6 text-primary-foreground" strokeWidth={2} />
					</div>
					<h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Sign in to your TrailNest account
					</p>
				</div>

				<Card className="shadow-sm border-border/60">
					<CardContent className="pt-6">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input
													type="email"
													autoComplete="email"
													placeholder="you@example.com"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center justify-between">
												<FormLabel>Password</FormLabel>
												<button
													type="button"
													className="text-xs text-primary hover:underline"
												>
													Forgot password?
												</button>
											</div>
											<FormControl>
												<Input
													type="password"
													autoComplete="current-password"
													placeholder="••••••••"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type="submit"
									className="w-full shadow-sm shadow-primary/20"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting ? "Signing in…" : "Sign in"}
								</Button>
							</form>
						</Form>
					</CardContent>

					<CardFooter className="flex flex-col gap-4 pb-6">
						<div className="flex items-center gap-3 w-full">
							<Separator className="flex-1" />
							<span className="text-xs text-muted-foreground">or</span>
							<Separator className="flex-1" />
						</div>
						<p className="text-center text-sm text-muted-foreground">
							Don't have an account?{" "}
							<Link
								to="/register"
								className="text-primary font-medium hover:underline"
							>
								Sign up
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
