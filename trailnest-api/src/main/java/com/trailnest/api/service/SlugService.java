package com.trailnest.api.service;

import org.springframework.stereotype.Service;

import com.trailnest.api.repository.CampgroundRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SlugService {

    private final CampgroundRepository campgroundRepository;

    /**
     * Generates a URL-safe slug from the given title.
     * If the base slug is already taken, appends "-2", "-3", etc. until unique.
     *
     * Example: "Rocky Mountain View" → "rocky-mountain-view"
     *          (if taken)            → "rocky-mountain-view-2"
     */
    public String generateSlug(String title) {
        String base = title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")  // keep letters, digits, spaces, hyphens
                .trim()
                .replaceAll("\\s+", "-")          // spaces → hyphens
                .replaceAll("-+", "-");           // collapse consecutive hyphens

        if (!campgroundRepository.existsBySlug(base)) return base;

        int suffix = 2;
        while (campgroundRepository.existsBySlug(base + "-" + suffix)) {
            suffix++;
        }
        return base + "-" + suffix;
    }
}
