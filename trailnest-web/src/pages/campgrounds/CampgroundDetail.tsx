import { campgroundsApi } from "@/api/campgrounds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
	ArrowLeft,
	CalendarDays,
	DollarSign,
	Edit,
	MapPin,
	Star,
	Tent,
	Trash2,
	Users,
} from "lucide-react";
import { toast } from "sonner";

// Star row
function Stars({ rating, count }: { rating: number; count: number }) {
	return (
		<div className="flex items-center gap-1.5">
			{Array.from({ length: 5 }).map((_, i) => (
				<Star
					key={i}
					className={`w-4 h-4 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
				/>
			))}
			<span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
			<span className="text-sm text-muted-foreground">({count} reviews)</span>
		</div>
	);
}

// Page
export default function CampgroundDetail() {
	const { slug } = useParams({ strict: false }) as { slug: string };
	const { user } = useAuthStore();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const {
		data: campground,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["campground", slug],
		queryFn: () => campgroundsApi.get(slug).then((r) => r.data.data),
		enabled: !!slug,
	});

	const deleteMutation = useMutation({
		mutationFn: () => campgroundsApi.delete(campground!.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["campgrounds"] });
			toast.success("Campground deleted");
			navigate({ to: "/campgrounds" });
		},
		onError: () => toast.error("Failed to delete campground"),
	});

	const isOwner = user && campground && user.id === campground.author.id;

	// Loading
	if (isLoading) {
		return (
			<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-72 w-full rounded-xl" />
				<Skeleton className="h-6 w-2/3" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-5/6" />
			</div>
		);
	}

	// Error / not found
	if (isError || !campground) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-20 text-center">
				<Tent className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
				<h2 className="text-2xl font-bold">Campground not found</h2>
				<p className="text-muted-foreground mt-2 mb-6">
					This campground doesn't exist or has been removed.
				</p>
				<Button asChild variant="outline">
					<Link to="/campgrounds">
						<ArrowLeft className="w-4 h-4 mr-1" /> Back to campgrounds
					</Link>
				</Button>
			</div>
		);
	}

	const primaryImage =
		campground.images.find((i) => i.primary) ?? campground.images[0];

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
			{/* Back + actions */}
			<div className="flex items-center justify-between mb-6">
				<Button variant="ghost" size="sm" asChild>
					<Link to="/campgrounds">
						<ArrowLeft className="w-4 h-4 mr-1" /> All campgrounds
					</Link>
				</Button>
				{isOwner && (
					<div className="flex gap-2">
						{/* Edit route added in a future step */}
						<Button variant="outline" size="sm" disabled>
							<Edit className="w-4 h-4 mr-1" /> Edit
						</Button>
						<Button
							variant="destructive"
							size="sm"
							onClick={() => {
								if (confirm("Delete this campground? This cannot be undone.")) {
									deleteMutation.mutate();
								}
							}}
							disabled={deleteMutation.isPending}
						>
							<Trash2 className="w-4 h-4 mr-1" />
							{deleteMutation.isPending ? "Deleting…" : "Delete"}
						</Button>
					</div>
				)}
			</div>

			{/* Hero image */}
			<div className="rounded-xl overflow-hidden h-72 sm:h-96 bg-muted mb-8">
				{primaryImage ? (
					<img
						src={primaryImage.url}
						alt={campground.title}
						className="w-full h-full object-cover"
					/>
				) : (
					<div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-3">
						<Tent className="w-16 h-16" />
						<span className="text-sm">No photos yet</span>
					</div>
				)}
			</div>

			{/* Title + rating */}
			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
				<div>
					<div className="flex items-center gap-2 flex-wrap mb-1">
						<h1 className="text-3xl font-bold tracking-tight">
							{campground.title}
						</h1>
						{campground.campgroundType && (
							<Badge variant="secondary" className="capitalize">
								{campground.campgroundType}
							</Badge>
						)}
					</div>
					<div className="flex items-center gap-1.5 text-muted-foreground">
						<MapPin className="w-4 h-4" />
						<span>{campground.location}</span>
					</div>
				</div>
				{campground.price != null && (
					<div className="flex items-baseline gap-1 shrink-0">
						<DollarSign className="w-5 h-5 text-primary" />
						<span className="text-3xl font-bold">{campground.price}</span>
						<span className="text-muted-foreground text-sm">/night</span>
					</div>
				)}
			</div>

			{/* Stars */}
			{campground.reviewCount > 0 && (
				<Stars rating={campground.avgRating} count={campground.reviewCount} />
			)}

			<Separator className="my-6" />

			{/* Quick stats */}
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
				{campground.maxCapacity && (
					<div className="flex items-center gap-2 text-sm text-muted-foreground">
						<Users className="w-4 h-4" />
						<span>Up to {campground.maxCapacity} people</span>
					</div>
				)}
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<CalendarDays className="w-4 h-4" />
					<span>
						Listed{" "}
						{new Date(campground.createdAt).toLocaleDateString("en-US", {
							month: "short",
							year: "numeric",
						})}
					</span>
				</div>
			</div>

			{/* Description */}
			{campground.description && (
				<>
					<h2 className="text-lg font-semibold mb-2">About this campground</h2>
					<p className="text-muted-foreground leading-relaxed whitespace-pre-line mb-6">
						{campground.description}
					</p>
					<Separator className="mb-6" />
				</>
			)}

			{/* Amenities */}
			{campground.amenities.length > 0 && (
				<>
					<h2 className="text-lg font-semibold mb-3">Amenities</h2>
					<div className="flex flex-wrap gap-2 mb-6">
						{campground.amenities.map((a) => (
							<Badge key={a} variant="secondary">
								{a}
							</Badge>
						))}
					</div>
					<Separator className="mb-6" />
				</>
			)}

			{/* Hosted by */}
			<h2 className="text-lg font-semibold mb-3">Hosted by</h2>
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
					{(campground.author.displayName ?? campground.author.username)
						.charAt(0)
						.toUpperCase()}
				</div>
				<div>
					<p className="font-medium">
						{campground.author.displayName ?? campground.author.username}
					</p>
					<p className="text-sm text-muted-foreground">
						@{campground.author.username}
					</p>
				</div>
			</div>
		</div>
	);
}
