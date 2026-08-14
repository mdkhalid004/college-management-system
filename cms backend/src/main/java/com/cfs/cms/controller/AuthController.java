package com.cfs.cms.controller;

import com.cfs.cms.dto.AuthResponse;
import com.cfs.cms.dto.LoginRequest;
import com.cfs.cms.dto.RegisterRequest;
import com.cfs.cms.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // Constructor Injection for the Service layer
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        try {
            // Delegate the logic to the service layer
            String message = authService.registerUser(request);
            // Returning JSON map instead of plain string
            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            // If the service throws an error, return 400 Bad Request with JSON error body
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Delegate authentication and token generation to the service layer
        AuthResponse response = authService.loginUser(request);
        return ResponseEntity.ok(response);
    }
}