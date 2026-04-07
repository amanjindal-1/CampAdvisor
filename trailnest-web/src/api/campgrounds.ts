import { apiClient } from "@/api/client";
import type { ApiResponse, PageResponse } from "@/types/api";
import type {
	Campground,
	CampgroundSummary,
	CreateCampgroundRequest,
	UpdateCampgroundRequest,
} from "@/types/campground";

export const campgroundsApi = {
	list: (page = 0, size = 12) =>
		apiClient.get<ApiResponse<PageResponse<CampgroundSummary>>>("/campgrounds", {
			params: { page, size },
		}),

	get: (slug: string) =>
		apiClient.get<ApiResponse<Campground>>(`/campgrounds/${slug}`),

	create: (data: CreateCampgroundRequest) =>
		apiClient.post<ApiResponse<Campground>>("/campgrounds", data),

	update: (id: string, data: UpdateCampgroundRequest) =>
		apiClient.put<ApiResponse<Campground>>(`/campgrounds/${id}`, data),

	delete: (id: string) =>
		apiClient.delete<ApiResponse<void>>(`/campgrounds/${id}`),

	mine: (page = 0, size = 12) =>
		apiClient.get<ApiResponse<PageResponse<CampgroundSummary>>>("/campgrounds/my", {
			params: { page, size },
		}),
};
