package com.trailnest.api.dto.auth;

import com.trailnest.api.dto.user.UserDto;

/**
 * Internal transfer object carrying both the access token and raw refresh token.
 * The controller splits these: access token → response body, refresh token → httpOnly cookie.
 */
public record AuthTokenPair(
        String accessToken,
        String rawRefreshToken,
        UserDto user
) {
    public AuthResponse toResponse() {
        return new AuthResponse(accessToken, user);
    }
}
