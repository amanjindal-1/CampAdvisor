package com.trailnest.api.dto.auth;

import jakarta.validation.constraints.*;

public record RegisterRequest(

        @NotBlank(message = "Display name is required")
        @Size(max = 80, message = "Display name must be 80 characters or less")
        String displayName,

        @NotBlank(message = "Username is required")
        @Size(min = 3, max = 30, message = "Username must be between 3 and 30 characters")
        @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username may only contain letters, numbers, and underscores")
        String username,

        @NotBlank(message = "Email is required")
        @Email(message = "Enter a valid email address")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters")
        String password
) {}
