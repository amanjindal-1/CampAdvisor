import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Globe,
	MapPin,
	Shield,
	Star,
	Users,
	Zap,
} from "lucide-react";

const stats = [
	{ icon: MapPin, label: "Campgrounds", value: "2,400+" },
	{ icon: Star, label: "Reviews", value: "18,000+" },
	{ icon: Users, label: "Adventurers", value: "5,600+" },
];

const features = [
	{
		icon: MapPin,
		title: "Interactive Maps",
		description:
			"Browse campgrounds on a live clustered map. Find spots near you or anywhere in the country.",
	},
	{
		icon: Star,
		title: "Verified Reviews",
		description:
			"Real reviews from real campers. One review per user per campground keeps it honest.",
	},
	{
		icon: Shield,
		title: "Trusted Community",
		description:
			"Campground owners can claim and manage their listings, keeping information accurate.",
	},
	{
		icon: Zap,
		title: "Trip Planner",
		description:
			"Build multi-stop itineraries, save favourites, and plan your next adventure in minutes.",
	},
	{
		icon: Globe,
		title: "Discover Nearby",
		description:
			"Radius-based geospatial search surfaces hidden gems within driving distance of you.",
	},
	{
		icon: Users,
		title: "Social Profiles",
		description:
			"Follow fellow campers, see their review history, and get personal recommendations.",
	},
];

export default function Home() {
	return (
		<div className="flex flex-col">
			{/* ── Hero ─────────────────────────────────────── */}
			<section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 py-24">
				{/* Background image */}
				<div
					className="absolute inset-0 bg-cover bg-center"
					style={{
						backgroundImage:
							"url('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1800&q=80')",
					}}
				/>
				{/* Dark gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
				{/* Green tint at bottom */}
				<div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary/20 to-transparent" />

				{/* Content */}
				<div className="relative z-10 max-w-3xl mx-auto text-center text-white">
					<Badge
						variant="outline"
						className="mb-6 border-white/30 text-white/80 bg-white/10 backdrop-blur-sm text-xs tracking-wide uppercase px-4 py-1.5"
					>
						🏕️ Your next adventure starts here
					</Badge>

					<h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight mb-6 drop-shadow-sm">
						Find your perfect
						<br />
						<span className="text-emerald-400">campsite</span>
					</h1>

					<p className="text-lg sm:text-xl text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
						Discover, review, and share campgrounds with thousands of outdoor
						enthusiasts.
					</p>

					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Button
							size="lg"
							className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 gap-2 px-8"
							asChild
						>
							<Link to="/campgrounds">
								Explore Campgrounds
								<ArrowRight className="w-4 h-4" />
							</Link>
						</Button>
						<Button
							size="lg"
							variant="outline"
							className="border-white/30 bg-white/10 hover:bg-white/20 text-white hover:text-white backdrop-blur-sm px-8"
							asChild
						>
							<Link to="/register">Join for free</Link>
						</Button>
					</div>
				</div>

				{/* Floating stats bar */}
				<div className="relative z-10 mt-16 w-full max-w-2xl mx-auto">
					<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 flex items-center justify-around gap-4">
						{stats.map(({ icon: Icon, label, value }, i) => (
							<div key={label} className="flex items-center gap-3 text-white">
								<Icon className="w-5 h-5 text-emerald-400 shrink-0" />
								<div>
									<p className="text-xl font-bold leading-none">{value}</p>
									<p className="text-xs text-white/60 mt-0.5">{label}</p>
								</div>
								{i < stats.length - 1 && (
									<div className="w-px h-8 bg-white/20 ml-3" />
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── Features ─────────────────────────────────── */}
			<section className="py-24 px-4 bg-background">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-16">
						<Badge
							variant="secondary"
							className="mb-4 text-primary font-medium"
						>
							Everything you need
						</Badge>
						<h2 className="text-4xl font-bold text-foreground mb-4">
							Built for real campers
						</h2>
						<p className="text-muted-foreground text-lg max-w-xl mx-auto">
							From weekend warriors to seasoned backpackers — TrailNest gives
							you the tools to plan better trips.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{features.map(({ icon: Icon, title, description }) => (
							<div
								key={title}
								className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
							>
								<div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
									<Icon className="w-5 h-5 text-primary" />
								</div>
								<h3 className="font-semibold text-foreground mb-2 text-base">
									{title}
								</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<Separator />

			{/* ── CTA ──────────────────────────────────────── */}
			<section className="py-24 px-4 bg-gradient-to-br from-primary/5 via-background to-accent/10">
				<div className="max-w-2xl mx-auto text-center">
					<h2 className="text-4xl font-bold text-foreground mb-4">
						Ready to explore?
					</h2>
					<p className="text-muted-foreground text-lg mb-8">
						Join over 5,600 adventurers discovering their next favourite spot.
					</p>
					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Button
							size="lg"
							className="gap-2 px-8 shadow-md shadow-primary/20"
							asChild
						>
							<Link to="/register">
								Create free account
								<ArrowRight className="w-4 h-4" />
							</Link>
						</Button>
						<Button
							size="lg"
							variant="ghost"
							className="text-muted-foreground"
							asChild
						>
							<Link to="/campgrounds">Browse campgrounds</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
