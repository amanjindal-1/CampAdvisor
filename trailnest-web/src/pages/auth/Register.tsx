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
	displayName: z.string().min(1, "Required").max(80),
	username: z
		.string()
		.min(3, "At least 3 characters")
		.max(30)
		.regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscores only"),
	email: z.string().email("Enter a valid email"),
	password: z.string().min(8, "At least 8 characters"),
});
type FormData = z.infer<typeof schema>;

const fields: {
	name: keyof FormData;
	label: string;
	type: string;
	placeholder: string;
	autoComplete: string;
}[] = [
	{
		name: "displayName",
		label: "Display name",
		type: "text",
		placeholder: "Jane Doe",
		autoComplete: "name",
	},
	{
		name: "username",
		label: "Username",
		type: "text",
		placeholder: "janedoe",
		autoComplete: "username",
	},
	{
		name: "email",
		label: "Email",
		type: "email",
		placeholder: "you@example.com",
		autoComplete: "email",
	},
	{
		name: "password",
		label: "Password",
		type: "password",
		placeholder: "At least 8 chars",
		autoComplete: "new-password",
	},
];

export default function Register() {
	const navigate = useNavigate();
	const { setAuth } = useAuthStore();
	const form = useForm<FormData>({ resolver: zodResolver(schema) });

	async function onSubmit(values: FormData) {
		try {
			const { data } = await apiClient.post("/auth/register", values);
			setAuth(data.data.user, data.data.accessToken);
			toast.success("Account created! Welcome to TrailNest.");
			navigate({ to: "/" });
		} catch (err: unknown) {
			toast.error(
				(err as { response?: { data?: { message?: string } } })?.response?.data
					?.message ?? "Registration failed",
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
					<h1 className="text-2xl font-bold text-foreground">
						Create your account
					</h1>
					<p className="text-sm text-muted-foreground mt-1">
						Join thousands of outdoor enthusiasts
					</p>
				</div>

				<Card className="shadow-sm border-border/60">
					<CardContent className="pt-6">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-4"
							>
								{fields.map((f) => (
									<FormField
										key={f.name}
										control={form.control}
										name={f.name}
										render={({ field }) => (
											<FormItem>
												<FormLabel>{f.label}</FormLabel>
												<FormControl>
													<Input
														type={f.type}
														autoComplete={f.autoComplete}
														placeholder={f.placeholder}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								))}

								<Button
									type="submit"
									className="w-full shadow-sm shadow-primary/20"
									disabled={form.formState.isSubmitting}
								>
									{form.formState.isSubmitting
										? "Creating account…"
										: "Create account"}
								</Button>

								<p className="text-xs text-center text-muted-foreground px-2">
									By signing up you agree to our{" "}
									<span className="text-primary cursor-pointer hover:underline">
										Terms
									</span>{" "}
									and{" "}
									<span className="text-primary cursor-pointer hover:underline">
										Privacy Policy
									</span>
								</p>
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
							Already have an account?{" "}
							<Link
								to="/login"
								className="text-primary font-medium hover:underline"
							>
								Sign in
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
