package com.trailnest.api.dto.campground;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import com.trailnest.api.dto.user.UserDto;

public record CampgroundResponse(
        UUID id,
        String title,
        String slug,
        String description,
        BigDecimal price,
        String location,
        Double latitude,
        Double longitude,
        Integer elevationM,
        List<String> amenities,
        String campgroundType,
        Integer maxCapacity,
        BigDecimal avgRating,
        Integer reviewCount,
        boolean published,
        boolean featured,
        List<CampgroundImageResponse> images,
        UserDto author,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {}
