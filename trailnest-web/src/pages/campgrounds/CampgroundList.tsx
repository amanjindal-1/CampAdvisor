import { campgroundsApi } from "@/api/campgrounds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CampgroundSummary } from "@/types/campground";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
	ChevronLeft,
	ChevronRight,
	MapPin,
	Plus,
	Star,
	Tent,
} from "lucide-react";
import { useState } from "react";

// Star rating display
function StarRating({ rating }: { rating: number }) {
	return (
		<div className="flex items-center gap-1">
			<Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
			<span className="text-sm font-medium">{rating.toFixed(1)}</span>
		</div>
	);
}

// Campground card
function CampgroundCard({ campground }: { campground: CampgroundSummary }) {
	return (
		<Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
			{/* Image */}
			<div className="relative h-48 bg-muted overflow-hidden">
				{campground.primaryImageUrl ? (
					<img
						src={campground.primaryImageUrl}
						alt={campground.title}
						className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
					/>
				) : (
					<div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/40 gap-2">
						<Tent className="w-12 h-12" />
						<span className="text-xs">No photo yet</span>
					</div>
				)}
				{campground.campgroundType && (
					<Badge className="absolute top-2 left-2 capitalize text-xs">
						{campground.campgroundType}
					</Badge>
				)}
			</div>

			{/* Content */}
			<CardContent className="p-4 pb-2">
				<h3 className="font-semibold text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
					{campground.title}
				</h3>
				<div className="flex items-center gap-1 text-muted-foreground mt-1">
					<MapPin className="w-3 h-3 shrink-0" />
					<span className="text-xs line-clamp-1">{campground.location}</span>
				</div>
				{campground.description && (
					<p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
						{campground.description}
					</p>
				)}
			</CardContent>

			{/* Footer */}
			<CardFooter className="px-4 pb-4 pt-2 flex items-center justify-between">
				<div className="flex items-center gap-2">
					{campground.reviewCount > 0 ? (
						<>
							<StarRating rating={campground.avgRating} />
							<span className="text-xs text-muted-foreground">
								({campground.reviewCount})
							</span>
						</>
					) : (
						<span className="text-xs text-muted-foreground">
							No reviews yet
						</span>
					)}
				</div>
				{campground.price != null && (
					<span className="text-sm font-semibold">
						${campground.price}
						<span className="font-normal text-muted-foreground text-xs">
							/night
						</span>
					</span>
				)}
			</CardFooter>
		</Card>
	);
}

// Skeleton loader
function CampgroundCardSkeleton() {
	return (
		<Card className="overflow-hidden">
			<Skeleton className="h-48 w-full rounded-none" />
			<CardContent className="p-4 space-y-2">
				<Skeleton className="h-5 w-3/4" />
				<Skeleton className="h-3.5 w-1/2" />
				<Skeleton className="h-3.5 w-full" />
				<Skeleton className="h-3.5 w-5/6" />
			</CardContent>
			<CardFooter className="px-4 pb-4 pt-0 flex justify-between">
				<Skeleton className="h-4 w-16" />
				<Skeleton className="h-4 w-20" />
			</CardFooter>
		</Card>
	);
}

// Page
export default function CampgroundList() {
	const [page, setPage] = useState(0);

	const { data, isLoading, isError } = useQuery({
		queryKey: ["campgrounds", page],
		queryFn: () => campgroundsApi.list(page).then((r) => r.data.data),
	});

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Campgrounds</h1>
					{data && (
						<p className="text-muted-foreground mt-1">
							{data.totalElements} campsite
							{data.totalElements !== 1 ? "s" : ""} found
						</p>
					)}
				</div>
				<Button asChild>
					<Link to="/campgrounds/new">
						<Plus className="w-4 h-4 mr-1" />
						Add Campground
					</Link>
				</Button>
			</div>

			{/* Error */}
			{isError && (
				<div className="text-center py-20 text-muted-foreground">
					<p className="text-lg font-medium">Failed to load campgrounds</p>
					<p className="text-sm mt-1">Make sure the backend is running.</p>
				</div>
			)}

			{/* Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{isLoading
					? Array.from({ length: 8 }).map((_, i) => (
							<CampgroundCardSkeleton key={i} />
						))
					: data?.content.map((c) => (
							<Link
								to="/campgrounds/$slug"
								params={{ slug: c.slug }}
								key={c.id}
							>
								<CampgroundCard campground={c} />
							</Link>
						))}
			</div>

			{/* Empty state */}
			{!isLoading && !isError && data?.content.length === 0 && (
				<div className="text-center py-24">
					<Tent className="w-14 h-14 mx-auto text-muted-foreground/30 mb-4" />
					<h2 className="text-xl font-semibold">No campgrounds yet</h2>
					<p className="text-muted-foreground mt-1 mb-6">
						Be the first to add one!
					</p>
					<Button asChild>
						<Link to="/campgrounds/new">Add the first campground</Link>
					</Button>
				</div>
			)}

			{/* Pagination */}
			{data && data.totalPages > 1 && (
				<div className="flex items-center justify-center gap-4 mt-12">
					<Button
						variant="outline"
						size="sm"
						onClick={() => setPage((p) => p - 1)}
						disabled={page === 0}
					>
						<ChevronLeft className="w-4 h-4 mr-1" /> Previous
					</Button>
					<span className="text-sm text-muted-foreground">
						Page {page + 1} of {data.totalPages}
					</span>
					<Button
						variant="outline"
						size="sm"
						onClick={() => setPage((p) => p + 1)}
						disabled={data.last}
					>
						Next <ChevronRight className="w-4 h-4 ml-1" />
					</Button>
				</div>
			)}
		</div>
	);
}
