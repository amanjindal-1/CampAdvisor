package com.trailnest.api.dto.campground;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * All fields are nullable — only non-null fields are applied during an update.
 */
public record UpdateCampgroundRequest(

        @Size(max = 255, message = "Title must be 255 characters or less")
        String title,

        @Size(max = 2000, message = "Description must be 2000 characters or less")
        String description,

        @Positive(message = "Price must be a positive number")
        BigDecimal price,

        @Size(max = 500, message = "Location must be 500 characters or less")
        String location,

        @DecimalMin(value = "-90.0", message = "Latitude must be between -90 and 90")
        @DecimalMax(value = "90.0", message = "Latitude must be between -90 and 90")
        Double latitude,

        @DecimalMin(value = "-180.0", message = "Longitude must be between -180 and 180")
        @DecimalMax(value = "180.0", message = "Longitude must be between -180 and 180")
        Double longitude,

        List<String> amenities,

        String campgroundType,

        @Positive(message = "Max capacity must be a positive number")
        Integer maxCapacity,

        Boolean published
) {}
