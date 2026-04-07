package com.trailnest.api.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trailnest.api.common.ApiResponse;
import com.trailnest.api.common.PageResponse;
import com.trailnest.api.dto.campground.CampgroundResponse;
import com.trailnest.api.dto.campground.CampgroundSummaryResponse;
import com.trailnest.api.dto.campground.CreateCampgroundRequest;
import com.trailnest.api.dto.campground.UpdateCampgroundRequest;
import com.trailnest.api.security.UserPrincipal;
import com.trailnest.api.service.CampgroundService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/campgrounds")
@RequiredArgsConstructor
public class CampgroundController {

    private final CampgroundService campgroundService;

    // GET /api/v1/campgrounds

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<CampgroundSummaryResponse>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(ApiResponse.ok(campgroundService.list(page, size)));
    }

    // POST /api/v1/campgrounds

    @PostMapping
    public ResponseEntity<ApiResponse<CampgroundResponse>> create(
            @Valid @RequestBody CreateCampgroundRequest req,
            @AuthenticationPrincipal UserPrincipal principal) {
        CampgroundResponse created = campgroundService.create(req, principal.getUser().getId());
        return ResponseEntity.status(201).body(ApiResponse.ok("Campground created", created));
    }

    // GET /api/v1/campgrounds/my

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PageResponse<CampgroundSummaryResponse>>> mine(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(ApiResponse.ok(
                campgroundService.getMyCampgrounds(principal.getUser().getId(), page, size)));
    }

    // GET /api/v1/campgrounds/{slug}

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<CampgroundResponse>> get(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(campgroundService.getBySlug(slug)));
    }

    // PUT /api/v1/campgrounds/{id}

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CampgroundResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCampgroundRequest req,
            @AuthenticationPrincipal UserPrincipal principal) {
        CampgroundResponse updated = campgroundService.update(id, req, principal.getUser().getId());
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    // DELETE /api/v1/campgrounds/{id}

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        campgroundService.delete(id, principal.getUser().getId());
        return ResponseEntity.ok(ApiResponse.ok(null));
    }
}
