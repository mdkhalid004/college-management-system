package com.cfs.cms.serviceImpl;

import com.cfs.cms.dto.AuthResponse;
import com.cfs.cms.dto.LoginRequest;
import com.cfs.cms.dto.RegisterRequest;
import com.cfs.cms.entity.Role;
import com.cfs.cms.entity.User;
import com.cfs.cms.repository.UserRepository;
import com.cfs.cms.security.JwtUtil;
import com.cfs.cms.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor Injection for Spring Boot 4.1.0 compatibility
    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserDetailsService userDetailsService,
                           JwtUtil jwtUtil,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public String registerUser(RegisterRequest request) {
        // Check if the user already exists in the database
        if (userRepository.findByEmail(request.email()).isPresent()) {
            // Throw an exception that the controller will catch
            throw new RuntimeException("Error: Email is already registered!");
        }

        // Create and populate the new User entity
        User user = new User();
        user.setEmail(request.email());

        // Hash the password using BCrypt before saving it to the database
        user.setPassword(passwordEncoder.encode(request.password()));

        // Map the first name and last name from the DTO to the entity
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        // Assign a default role to the new user
        user.setRole(Role.STUDENT);

        // Persist the user entity in MySQL
        userRepository.save(user);

        return "User registered successfully!";
    }

    @Override
    public AuthResponse loginUser(LoginRequest request) {
        // Authenticate user credentials via Spring Security AuthenticationManager
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // Fetch user details and generate JWT token upon successful authentication
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.email());
        String token = jwtUtil.generateToken(userDetails.getUsername());

        return new AuthResponse(token, "Login successful");
    }
}