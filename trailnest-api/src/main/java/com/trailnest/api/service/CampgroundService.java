package com.trailnest.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.trailnest.api.common.PageResponse;
import com.trailnest.api.domain.Campground;
import com.trailnest.api.domain.CampgroundImage;
import com.trailnest.api.domain.User;
import com.trailnest.api.dto.campground.CampgroundImageResponse;
import com.trailnest.api.dto.campground.CampgroundResponse;
import com.trailnest.api.dto.campground.CampgroundSummaryResponse;
import com.trailnest.api.dto.campground.CreateCampgroundRequest;
import com.trailnest.api.dto.campground.UpdateCampgroundRequest;
import com.trailnest.api.dto.user.UserDto;
import com.trailnest.api.repository.CampgroundRepository;
import com.trailnest.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampgroundService {

    private final CampgroundRepository campgroundRepository;
    private final UserRepository userRepository;
    private final SlugService slugService;

    @Transactional
    public CampgroundResponse create(CreateCampgroundRequest req, UUID authorId) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Campground campground = Campground.builder()
                .title(req.title())
                .slug(slugService.generateSlug(req.title()))
                .description(req.description())
                .price(req.price())
                .location(req.location())
                .amenities(req.amenities() != null ? req.amenities() : List.of())
                .campgroundType(req.campgroundType())
                .maxCapacity(req.maxCapacity())
                .author(author)
                .build();

        campgroundRepository.save(campground);

        // Set PostGIS coordinates via native query after the row exists
        if (req.latitude() != null && req.longitude() != null) {
            campgroundRepository.updateCoordinates(campground.getId(), req.latitude(), req.longitude());
        }

        return toResponse(campground, req.latitude(), req.longitude());
    }

    @Transactional(readOnly = true)
    public PageResponse<CampgroundSummaryResponse> list(int page, int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 50));
        Page<Campground> result = campgroundRepository.findAllPublished(pageable);
        return PageResponse.from(result.map(this::toSummary));
    }

    @Transactional(readOnly = true)
    public CampgroundResponse getBySlug(String slug) {
        Campground c = campgroundRepository.findBySlug(slug)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campground not found"));
        return toResponse(c, null, null);
    }

    @Transactional
    public CampgroundResponse update(UUID id, UpdateCampgroundRequest req, UUID requesterId) {
        Campground campground = campgroundRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campground not found"));

        if (!campground.getAuthor().getId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this campground");
        }

        if (req.title() != null)
            campground.setTitle(req.title());
        if (req.description() != null)
            campground.setDescription(req.description());
        if (req.price() != null)
            campground.setPrice(req.price());
        if (req.location() != null)
            campground.setLocation(req.location());
        if (req.amenities() != null)
            campground.setAmenities(req.amenities());
        if (req.campgroundType() != null)
            campground.setCampgroundType(req.campgroundType());
        if (req.maxCapacity() != null)
            campground.setMaxCapacity(req.maxCapacity());
        if (req.published() != null)
            campground.setPublished(req.published());

        campgroundRepository.save(campground);

        if (req.latitude() != null && req.longitude() != null) {
            campgroundRepository.updateCoordinates(campground.getId(), req.latitude(), req.longitude());
        }

        return toResponse(campground, req.latitude(), req.longitude());
    }

    @Transactional
    public void delete(UUID id, UUID requesterId) {
        Campground campground = campgroundRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Campground not found"));

        if (!campground.getAuthor().getId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this campground");
        }

        campgroundRepository.delete(campground);
    }

    @Transactional(readOnly = true)
    public PageResponse<CampgroundSummaryResponse> getMyCampgrounds(UUID authorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 50));
        return PageResponse.from(
                campgroundRepository.findByAuthorId(authorId, pageable).map(this::toSummary));
    }
    private CampgroundResponse toResponse(Campground c, Double lat, Double lng) {
        List<CampgroundImageResponse> images = c.getImages().stream()
                .map(img -> new CampgroundImageResponse(img.getId(), img.getUrl(),
                        img.isPrimary(), img.getDisplayOrder()))
                .toList();

        User a = c.getAuthor();
        UserDto authorDto = new UserDto(a.getId(), a.getEmail(), a.getUsername(),
                a.getDisplayName(), a.getAvatarUrl(), null, a.getRole(), a.isVerified());

        return new CampgroundResponse(
                c.getId(), c.getTitle(), c.getSlug(), c.getDescription(),
                c.getPrice(), c.getLocation(), lat, lng,
                c.getElevationM(), c.getAmenities(), c.getCampgroundType(),
                c.getMaxCapacity(), c.getAvgRating(), c.getReviewCount(),
                c.isPublished(), c.isFeatured(),
                images, authorDto, c.getCreatedAt(), c.getUpdatedAt());
    }

    private CampgroundSummaryResponse toSummary(Campground c) {
        String primaryImageUrl = c.getImages().stream()
                .filter(CampgroundImage::isPrimary)
                .findFirst()
                .or(() -> c.getImages().stream().findFirst())
                .map(CampgroundImage::getUrl)
                .orElse(null);

        return new CampgroundSummaryResponse(
                c.getId(), c.getTitle(), c.getSlug(), c.getDescription(),
                c.getPrice(), c.getLocation(), c.getAvgRating(), c.getReviewCount(),
                c.getCampgroundType(), primaryImageUrl, c.getCreatedAt());
    }
}
