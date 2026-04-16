import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z
	.object({
		newPassword: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((v) => v.newPassword === v.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
type FormValues = z.infer<typeof schema>;

export default function ResetPassword() {
	const { token } = useParams({ from: "/reset-password/$token" });
	const navigate = useNavigate();
	const [done, setDone] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { newPassword: "", confirmPassword: "" },
	});

	const mutation = useMutation({
		mutationFn: (values: FormValues) =>
			authApi.resetPassword(token, values.newPassword),
		onSuccess: () => setDone(true),
		onError: (err: any) =>
			toast.error(
				err?.response?.data?.message ?? "Reset link is invalid or expired.",
			),
	});

	if (done) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-2" />
						<CardTitle>Password reset!</CardTitle>
						<CardDescription>
							Your password has been updated successfully.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							className="w-full"
							onClick={() => navigate({ to: "/login" })}
						>
							Log in with new password
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl">Reset your password</CardTitle>
					<CardDescription>
						Enter a new password for your account.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit((v: FormValues) =>
								mutation.mutate(v),
							)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>New password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="At least 8 characters"
												autoComplete="new-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm password</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Repeat your password"
												autoComplete="new-password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="w-full"
								disabled={mutation.isPending}
							>
								{mutation.isPending && (
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								)}
								Reset password
							</Button>
							<p className="text-center text-sm text-muted-foreground">
								Remembered it?{" "}
								<Link to="/login" className="text-primary hover:underline">
									Log in
								</Link>
							</p>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
