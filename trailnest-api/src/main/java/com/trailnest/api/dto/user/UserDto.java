package com.trailnest.api.dto.user;

import java.util.UUID;

public record UserDto(
        UUID id,
        String email,
        String username,
        String displayName,
        String avatarUrl,
        String bio,
        String role,
        boolean verified
) {}
