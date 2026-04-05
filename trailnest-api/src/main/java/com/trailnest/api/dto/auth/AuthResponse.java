package com.trailnest.api.dto.auth;

import com.trailnest.api.dto.user.UserDto;

/**
 * Response body returned to the client after successful authentication.
 * The raw refresh token is NOT included here — it is sent as an httpOnly cookie.
 */
public record AuthResponse(
        String accessToken,
        UserDto user
) {}
