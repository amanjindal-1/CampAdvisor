package com.trailnest.api.dto.campground;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

public record CampgroundSummaryResponse(
        UUID id,
        String title,
        String slug,
        String description,
        BigDecimal price,
        String location,
        BigDecimal avgRating,
        Integer reviewCount,
        String campgroundType,
        String primaryImageUrl,
        OffsetDateTime createdAt
) {}
