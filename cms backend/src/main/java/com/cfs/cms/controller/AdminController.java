package com.cfs.cms.controller;

import com.cfs.cms.dto.AdminProfileDto;
import com.cfs.cms.dto.ChangePasswordDto;
import com.cfs.cms.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/profile")
    public ResponseEntity<AdminProfileDto> getProfile(Authentication authentication) {
        String email = authentication.getName();
        AdminProfileDto profile = adminService.getAdminProfile(email);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<AdminProfileDto> updateProfile(Authentication authentication, @RequestBody AdminProfileDto profileDto) {
        String email = authentication.getName();
        AdminProfileDto updatedProfile = adminService.updateAdminProfile(email, profileDto);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(Authentication authentication, @RequestBody ChangePasswordDto passwordDto) {
        String email = authentication.getName();
        adminService.changePassword(email, passwordDto);
        return ResponseEntity.ok("Password changed successfully!");
    }
}