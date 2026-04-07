package com.trailnest.api.dto.campground;

import java.util.UUID;

public record CampgroundImageResponse(
        UUID id,
        String url,
        boolean primary,
        int displayOrder
) {}
