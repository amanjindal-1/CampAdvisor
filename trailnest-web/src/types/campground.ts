export interface CampgroundImage {
	id: string;
	url: string;
	primary: boolean;
	displayOrder: number;
}

export interface CampgroundAuthor {
	id: string;
	email: string;
	username: string;
	displayName: string | null;
	avatarUrl: string | null;
	role: string;
	verified: boolean;
}

/** Full detail — returned by GET /campgrounds/:slug */
export interface Campground {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	price: number | null;
	location: string;
	latitude: number | null;
	longitude: number | null;
	elevationM: number | null;
	amenities: string[];
	campgroundType: string | null;
	maxCapacity: number | null;
	avgRating: number;
	reviewCount: number;
	published: boolean;
	featured: boolean;
	images: CampgroundImage[];
	author: CampgroundAuthor;
	createdAt: string;
	updatedAt: string;
}

/** Lightweight card — returned by GET /campgrounds (list) */
export interface CampgroundSummary {
	id: string;
	title: string;
	slug: string;
	description: string | null;
	price: number | null;
	location: string;
	avgRating: number;
	reviewCount: number;
	campgroundType: string | null;
	primaryImageUrl: string | null;
	createdAt: string;
}

export interface CreateCampgroundRequest {
	title: string;
	description?: string;
	price?: number;
	location: string;
	latitude?: number;
	longitude?: number;
	amenities?: string[];
	campgroundType?: string;
	maxCapacity?: number;
}

export interface UpdateCampgroundRequest extends Partial<CreateCampgroundRequest> {
	published?: boolean;
}
