package com.cfs.cms.controller;
import com.cfs.cms.entity.Role;
import com.cfs.cms.dto.AuthResponse;
import com.cfs.cms.dto.LoginRequest;
import com.cfs.cms.dto.RegisterRequest;
import com.cfs.cms.entity.User;
import com.cfs.cms.repository.UserRepository;
import com.cfs.cms.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor Injection for Spring Boot 4.1.0 compatibility
    public AuthController(AuthenticationManager authenticationManager,
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

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {

        // Check if the user already exists in the database
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already registered!");
        }

        // Create and populate the new User entity
        User user = new User();
        user.setEmail(request.email());

        // Hash the password using BCrypt before saving it to the database
        user.setPassword(passwordEncoder.encode(request.password()));

        // Map the first name and last name from the DTO to the entity
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        // Assign a default role to the new user (Make sure Role is imported)
        user.setRole(Role.STUDENT);

        // Persist the user entity in MySQL
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

        // Authenticate user credentials via Spring Security AuthenticationManager
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // Fetch user details and generate JWT token upon successful authentication
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.email());
        String token = jwtUtil.generateToken(userDetails.getUsername());

        return ResponseEntity.ok(new AuthResponse(token, "Login successful"));
    }
}