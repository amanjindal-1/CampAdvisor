package com.trailnest.api.dto.user;

import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 255) String displayName,
        @Size(max = 500) String bio
) {}
