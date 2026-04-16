package com.trailnest.api.controller;

import com.trailnest.api.common.ApiResponse;
import com.trailnest.api.dto.auth.AuthResponse;
import com.trailnest.api.dto.auth.AuthTokenPair;
import com.trailnest.api.dto.auth.ForgotPasswordRequest;
import com.trailnest.api.dto.auth.LoginRequest;
import com.trailnest.api.dto.auth.RegisterRequest;
import com.trailnest.api.dto.auth.ResetPasswordRequest;
import com.trailnest.api.dto.user.UserDto;
import com.trailnest.api.security.UserPrincipal;
import com.trailnest.api.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Arrays;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final String REFRESH_COOKIE = "refreshToken";

    private final AuthService authService;

    @Value("${jwt.refresh-token-expiry-ms}")
    private long refreshTokenExpiryMs;

    // POST /api/v1/auth/register 
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest req,
            HttpServletResponse response
    ) {
        AuthTokenPair pair = authService.register(req);
        setRefreshCookie(response, pair.rawRefreshToken());
        return ResponseEntity.status(201)
                .body(ApiResponse.ok("Account created successfully", pair.toResponse()));
    }

    // POST /api/v1/auth/login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest req,
            HttpServletResponse response
    ) {
        AuthTokenPair pair = authService.login(req);
        setRefreshCookie(response, pair.rawRefreshToken());
        return ResponseEntity.ok(ApiResponse.ok(pair.toResponse()));
    }

    // POST /api/v1/auth/refresh
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String rawToken = extractRefreshCookie(request);
        AuthTokenPair pair = authService.refresh(rawToken);
        setRefreshCookie(response, pair.rawRefreshToken());
        return ResponseEntity.ok(ApiResponse.ok(pair.toResponse()));
    }

    // POST /api/v1/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        String rawToken = extractRefreshCookie(request);
        authService.logout(rawToken);
        clearRefreshCookie(response);
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // GET /api/v1/auth/me
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> me(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        UUID userId = principal.getUser().getId();
        return ResponseEntity.ok(ApiResponse.ok(authService.getCurrentUser(userId)));
    }

    // POST /api/v1/auth/verify-email?token=xxx
    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.ok("Email verified successfully", null));
    }

    // POST /api/v1/auth/resend-verification
    @PostMapping("/resend-verification")
    public ResponseEntity<ApiResponse<Void>> resendVerification(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        authService.resendVerification(principal.getUser().getId());
        return ResponseEntity.ok(ApiResponse.ok("Verification email sent", null));
    }

    // POST /api/v1/auth/forgot-password
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest req
    ) {
        authService.forgotPassword(req.email());
        // Always same response — don't reveal whether email exists
        return ResponseEntity.ok(ApiResponse.ok("If that email is registered, a reset link has been sent", null));
    }

    // POST /api/v1/auth/reset-password
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest req
    ) {
        authService.resetPassword(req.token(), req.newPassword());
        return ResponseEntity.ok(ApiResponse.ok("Password reset successfully. Please log in.", null));
    }

    // Cookie helpers
    private void setRefreshCookie(HttpServletResponse response, String rawToken) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE, rawToken)
                .httpOnly(true)
                .secure(false)          // set to true in production (HTTPS only)
                .path("/api/v1/auth")   // scoped: browser only sends it on auth endpoints
                .maxAge(Duration.ofMillis(refreshTokenExpiryMs))
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE, "")
                .httpOnly(true)
                .secure(false)
                .path("/api/v1/auth")
                .maxAge(Duration.ZERO)
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private String extractRefreshCookie(HttpServletRequest request) {
        if (request.getCookies() == null) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED, "No refresh token provided");
        }
        return Arrays.stream(request.getCookies())
                .filter(c -> REFRESH_COOKIE.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.UNAUTHORIZED, "No refresh token provided"));
    }
}
