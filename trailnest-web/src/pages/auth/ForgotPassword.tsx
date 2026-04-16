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
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
	email: z.string().email("Enter a valid email address"),
});
type FormValues = z.infer<typeof schema>;

export default function ForgotPassword() {
	const [submitted, setSubmitted] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: { email: "" },
	});

	const mutation = useMutation({
		mutationFn: (values: FormValues) => authApi.forgotPassword(values.email),
		onSuccess: () => setSubmitted(true),
		onError: () => toast.error("Something went wrong. Please try again."),
	});

	if (submitted) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<MailCheck className="w-12 h-12 mx-auto text-primary mb-2" />
						<CardTitle>Check your email</CardTitle>
						<CardDescription>
							If that email is registered, we've sent a reset link. Check your
							inbox (and spam folder).
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="outline" asChild className="w-full">
							<Link to="/login">Back to login</Link>
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
					<Button
						variant="ghost"
						size="sm"
						asChild
						className="-ml-2 mb-2 w-fit"
					>
						<Link to="/login">
							<ArrowLeft className="w-4 h-4 mr-1" /> Back to login
						</Link>
					</Button>
					<CardTitle className="text-2xl">Forgot password</CardTitle>
					<CardDescription>
						Enter your email and we'll send you a reset link.
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
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="you@example.com"
												autoComplete="email"
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
								Send reset link
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
