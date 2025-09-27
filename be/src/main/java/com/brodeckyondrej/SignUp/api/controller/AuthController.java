package com.brodeckyondrej.SignUp.api.controller;

import com.brodeckyondrej.SignUp.business.dto.auth.JwtResponse;
import com.brodeckyondrej.SignUp.business.dto.auth.LoginRequest;
import com.brodeckyondrej.SignUp.business.dto.auth.RegisterRequest;
import com.brodeckyondrej.SignUp.persistence.entity.User;
import com.brodeckyondrej.SignUp.persistence.repository.UserRepository;
import com.brodeckyondrej.SignUp.security.JwtTokenProvider;
import com.brodeckyondrej.SignUp.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            return ResponseEntity.ok(new JwtResponse(
                jwt,
                userPrincipal.getId(),
                userPrincipal.getName(),
                userPrincipal.getUsername(),
                userPrincipal.getUser().getRole()
            ));
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Email is already taken!");
            return ResponseEntity.badRequest().body(error);
        }

        // Create new user
        User user = new User(
            registerRequest.getName(),
            passwordEncoder.encode(registerRequest.getPassword()),
            registerRequest.getEmail(),
            registerRequest.getRole()
        );

        User savedUser = userRepository.save(user);

        // Generate JWT token for the new user
        String jwt = tokenProvider.generateTokenFromUsername(savedUser.getEmail());

        return ResponseEntity.ok(new JwtResponse(
            jwt,
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getRole()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", userPrincipal.getId());
        userInfo.put("name", userPrincipal.getName());
        userInfo.put("email", userPrincipal.getUsername());
        userInfo.put("role", userPrincipal.getUser().getRole());

        return ResponseEntity.ok(userInfo);
    }
}