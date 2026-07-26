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

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // Constructor Injection for the Service layer
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            // Delegate the logic to the service layer
            String message = authService.registerUser(request);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            // If the service throws an error (like email already exists), catch and return 400 Bad Request
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Delegate authentication and token generation to the service layer
        AuthResponse response = authService.loginUser(request);
        return ResponseEntity.ok(response);
    }
}