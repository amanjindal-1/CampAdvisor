import { campgroundsApi } from "@/api/campgrounds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { CampgroundSummary } from "@/types/campground";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { MapPin, Pencil, Plus, Star, Tent, Trash2 } from "lucide-react";
import { toast } from "sonner";

function CampgroundRow({ campground }: { campground: CampgroundSummary }) {
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: () => campgroundsApi.delete(campground.id),
		onSuccess: () => {
			toast.success("Campground deleted");
			queryClient.invalidateQueries({ queryKey: ["my-campgrounds"] });
		},
		onError: () => toast.error("Failed to delete campground"),
	});

	const handleDelete = () => {
		if (confirm(`Delete "${campground.title}"? This cannot be undone.`)) {
			deleteMutation.mutate();
		}
	};

	return (
		<Card>
			<CardContent className="p-4 flex gap-4">
				<div className="w-24 h-20 rounded-md bg-muted overflow-hidden shrink-0">
					{campground.primaryImageUrl ? (
						<img
							src={campground.primaryImageUrl}
							alt={campground.title}
							className="w-full h-full object-cover"
						/>
					) : (
						<div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
							<Tent className="w-8 h-8" />
						</div>
					)}
				</div>

				{/* Info */}
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<div className="min-w-0">
							<h3 className="font-semibold truncate">{campground.title}</h3>
							<div className="flex items-center gap-1 text-muted-foreground mt-0.5">
								<MapPin className="w-3 h-3 shrink-0" />
								<span className="text-xs truncate">{campground.location}</span>
							</div>
						</div>
						<div className="flex items-center gap-1 shrink-0">
							{campground.campgroundType && (
								<Badge variant="secondary" className="capitalize text-xs">
									{campground.campgroundType}
								</Badge>
							)}
						</div>
					</div>

					<div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
						{campground.reviewCount > 0 ? (
							<div className="flex items-center gap-1">
								<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
								<span>{campground.avgRating.toFixed(1)}</span>
								<span>({campground.reviewCount})</span>
							</div>
						) : (
							<span className="text-xs">No reviews yet</span>
						)}
						{campground.price != null && (
							<span className="text-xs font-medium">
								${campground.price}/night
							</span>
						)}
					</div>
				</div>
			</CardContent>

			<Separator />

			<CardFooter className="px-4 py-3 flex justify-end gap-2">
				<Button variant="outline" size="sm" asChild>
					<Link to="/campgrounds/$slug" params={{ slug: campground.slug }}>
						View
					</Link>
				</Button>
				<Button variant="outline" size="sm" asChild>
					<Link to="/campgrounds/$slug/edit" params={{ slug: campground.slug }}>
						<Pencil className="w-3.5 h-3.5 mr-1" /> Edit
					</Link>
				</Button>
				<Button
					variant="destructive"
					size="sm"
					onClick={handleDelete}
					disabled={deleteMutation.isPending}
				>
					<Trash2 className="w-3.5 h-3.5 mr-1" />
					Delete
				</Button>
			</CardFooter>
		</Card>
	);
}

function CampgroundRowSkeleton() {
	return (
		<Card>
			<CardContent className="p-4 flex gap-4">
				<Skeleton className="w-24 h-20 rounded-md shrink-0" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-5 w-1/2" />
					<Skeleton className="h-3.5 w-1/3" />
					<Skeleton className="h-3.5 w-1/4" />
				</div>
			</CardContent>
		</Card>
	);
}

export default function MyCampgrounds() {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["my-campgrounds"],
		queryFn: () => campgroundsApi.mine().then((r) => r.data.data),
	});

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">My Campgrounds</h1>
					{data && (
						<p className="text-muted-foreground mt-1">
							{data.totalElements} campground
							{data.totalElements !== 1 ? "s" : ""}
						</p>
					)}
				</div>
				<Button asChild>
					<Link to="/campgrounds/new">
						<Plus className="w-4 h-4 mr-1" /> Add new
					</Link>
				</Button>
			</div>

			{isError && (
				<p className="text-center text-muted-foreground py-12">
					Failed to load your campgrounds.
				</p>
			)}

			<div className="space-y-4">
				{isLoading
					? Array.from({ length: 3 }).map((_, i) => (
							<CampgroundRowSkeleton key={i} />
						))
					: data?.content.map((c) => (
							<CampgroundRow key={c.id} campground={c} />
						))}
			</div>

			{!isLoading && !isError && data?.content.length === 0 && (
				<div className="text-center py-24">
					<Tent className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
					<h2 className="text-xl font-semibold">No campgrounds yet</h2>
					<p className="text-muted-foreground mt-1 mb-6">
						Add your first campground to get started.
					</p>
					<Button asChild>
						<Link to="/campgrounds/new">Add campground</Link>
					</Button>
				</div>
			)}
		</div>
	);
}
