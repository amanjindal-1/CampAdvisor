import { authApi } from "@/api/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function VerifyEmail() {
	const { token } = useParams({ from: "/verify-email/$token" });

	const { isLoading, isSuccess, error } = useQuery({
		queryKey: ["verify-email", token],
		queryFn: () => authApi.verifyEmail(token),
		retry: false,
	});

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	if (isSuccess) {
		return (
			<div className="min-h-screen flex items-center justify-center px-4">
				<Card className="w-full max-w-md text-center">
					<CardHeader>
						<CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-2" />
						<CardTitle>Email verified!</CardTitle>
						<CardDescription>
							Your email has been verified successfully. You can now use all
							features.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild className="w-full">
							<Link to="/">Go to home</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		);
	}

	const message =
		(error as any)?.response?.data?.message ??
		"The verification link is invalid or has expired.";

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<Card className="w-full max-w-md text-center">
				<CardHeader>
					<XCircle className="w-12 h-12 mx-auto text-destructive mb-2" />
					<CardTitle>Verification failed</CardTitle>
					<CardDescription>{message}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-2">
					<Button asChild className="w-full">
						<Link to="/login">Go to login</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
