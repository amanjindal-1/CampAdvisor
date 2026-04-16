import { campgroundsApi } from "@/api/campgrounds";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const AMENITIES = [
	"Drinking Water",
	"Restrooms",
	"Showers",
	"Fire Pit",
	"Picnic Table",
	"Electrical Hookup",
	"RV Hookup",
	"Pet Friendly",
	"WiFi",
	"Parking",
];

const CAMPGROUND_TYPES = [
	{ value: "tent", label: "Tent Camping" },
	{ value: "rv", label: "RV / Vehicle" },
	{ value: "cabin", label: "Cabin" },
	{ value: "glamping", label: "Glamping" },
	{ value: "backcountry", label: "Backcountry" },
];

const toNum = (v: string | undefined) => (v ? parseFloat(v) : NaN);

const schema = z.object({
	title: z.string().min(3, "Title must be at least 3 characters").max(255),
	description: z.string().max(2000).optional(),
	price: z
		.string()
		.optional()
		.refine(
			(v) => !v || (!isNaN(toNum(v)) && toNum(v) > 0),
			"Must be a positive number",
		),
	location: z
		.string()
		.min(3, "Location must be at least 3 characters")
		.max(500),
	latitude: z
		.string()
		.optional()
		.refine(
			(v) => !v || (toNum(v) >= -90 && toNum(v) <= 90),
			"Must be between -90 and 90",
		),
	longitude: z
		.string()
		.optional()
		.refine(
			(v) => !v || (toNum(v) >= -180 && toNum(v) <= 180),
			"Must be between -180 and 180",
		),
	amenities: z.array(z.string()),
	campgroundType: z.string().optional(),
	maxCapacity: z
		.string()
		.optional()
		.refine(
			(v) => !v || (Number.isInteger(toNum(v)) && toNum(v) > 0),
			"Must be a positive whole number",
		),
});

type FormValues = z.infer<typeof schema>;

export default function EditCampground() {
	const { slug } = useParams({ from: "/protected/campgrounds/$slug/edit" });
	const navigate = useNavigate();

	const { data: campground, isLoading } = useQuery({
		queryKey: ["campground", slug],
		queryFn: () => campgroundsApi.get(slug).then((r) => r.data.data),
	});

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			title: "",
			description: "",
			location: "",
			amenities: [] as string[],
			campgroundType: "",
		},
	});

	// Pre-fill form once campground data is loaded
	useEffect(() => {
		if (!campground) return;
		form.reset({
			title: campground.title,
			description: campground.description ?? "",
			price: campground.price != null ? String(campground.price) : "",
			location: campground.location,
			amenities: campground.amenities ?? [],
			campgroundType: campground.campgroundType ?? "",
			maxCapacity:
				campground.maxCapacity != null ? String(campground.maxCapacity) : "",
		});
	}, [campground, form]);

	const mutation = useMutation({
		mutationFn: (values: FormValues) =>
			campgroundsApi.update(campground!.id, {
				title: values.title,
				description: values.description || undefined,
				price: values.price ? parseFloat(values.price) : undefined,
				location: values.location,
				latitude: values.latitude ? parseFloat(values.latitude) : undefined,
				longitude: values.longitude ? parseFloat(values.longitude) : undefined,
				amenities: values.amenities,
				campgroundType: values.campgroundType || undefined,
				maxCapacity: values.maxCapacity
					? parseInt(values.maxCapacity)
					: undefined,
			}),
		onSuccess: (res) => {
			toast.success("Campground updated!");
			navigate({
				to: "/campgrounds/$slug",
				params: { slug: res.data.data.slug },
			});
		},
		onError: () => toast.error("Failed to update campground"),
	});

	if (isLoading) {
		return (
			<div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-4">
				<Skeleton className="h-8 w-32" />
				<Skeleton className="h-[600px] w-full rounded-xl" />
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
			<Button variant="ghost" size="sm" asChild className="mb-6">
				<Link to="/campgrounds/$slug" params={{ slug }}>
					<ArrowLeft className="w-4 h-4 mr-1" /> Back
				</Link>
			</Button>

			<Card>
				<CardHeader>
					<CardTitle className="text-2xl">Edit campground</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit((v: FormValues) =>
								mutation.mutate(v),
							)}
							className="space-y-6"
						>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title *</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g. Rocky Mountain Vista"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Describe what makes this campground special…"
												className="resize-none min-h-28"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price per night ($)</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
													min="0"
													placeholder="0.00"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="maxCapacity"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Max capacity</FormLabel>
											<FormControl>
												<Input
													type="number"
													min="1"
													placeholder="e.g. 6"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<Separator />

							<FormField
								control={form.control}
								name="location"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Location *</FormLabel>
										<FormControl>
											<Input
												placeholder="e.g. Rocky Mountain National Park, CO"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="latitude"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Latitude</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="any"
													placeholder="e.g. 40.3428"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="longitude"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Longitude</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="any"
													placeholder="e.g. -105.6836"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<Separator />

							<FormField
								control={form.control}
								name="campgroundType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Campground type</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{CAMPGROUND_TYPES.map((t) => (
													<SelectItem key={t.value} value={t.value}>
														{t.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="amenities"
								render={() => (
									<FormItem>
										<FormLabel>Amenities</FormLabel>
										<div className="grid grid-cols-2 gap-2 mt-2">
											{AMENITIES.map((amenity) => (
												<FormField
													key={amenity}
													control={form.control}
													name="amenities"
													render={({ field }) => (
														<FormItem className="flex items-center gap-2 space-y-0">
															<FormControl>
																<Checkbox
																	checked={field.value?.includes(amenity)}
																	onCheckedChange={(checked) => {
																		const current = field.value ?? [];
																		field.onChange(
																			checked
																				? [...current, amenity]
																				: current.filter((v) => v !== amenity),
																		);
																	}}
																/>
															</FormControl>
															<FormLabel className="font-normal cursor-pointer">
																{amenity}
															</FormLabel>
														</FormItem>
													)}
												/>
											))}
										</div>
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
								{mutation.isPending ? "Saving…" : "Save changes"}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
}
