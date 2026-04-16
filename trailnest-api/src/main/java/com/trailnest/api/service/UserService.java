package com.trailnest.api.service;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.trailnest.api.domain.User;
import com.trailnest.api.dto.user.UpdateProfileRequest;
import com.trailnest.api.dto.user.UserDto;
import com.trailnest.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;

    @Transactional
    public UserDto updateProfile(UUID userId, UpdateProfileRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (req.displayName() != null)
            user.setDisplayName(req.displayName());
        if (req.bio() != null)
            user.setBio(req.bio());

        userRepository.save(user);
        return authService.toDto(user);
    }
}
