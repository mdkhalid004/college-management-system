package com.cfs.cms.service;

import com.cfs.cms.dto.AuthResponse;
import com.cfs.cms.dto.LoginRequest;
import com.cfs.cms.dto.RegisterRequest;

public interface AuthService {

    // Method to handle user registration
    String registerUser(RegisterRequest request);

    // Method to handle user login and token generation
    AuthResponse loginUser(LoginRequest request);
}