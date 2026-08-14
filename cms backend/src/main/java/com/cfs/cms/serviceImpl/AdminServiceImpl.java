package com.cfs.cms.serviceImpl;

import com.cfs.cms.dto.AdminProfileDto;
import com.cfs.cms.dto.ChangePasswordDto;
import com.cfs.cms.entity.User;
import com.cfs.cms.repository.UserRepository;
import com.cfs.cms.service.AdminService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AdminProfileDto getAdminProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String fullName = (user.getFirstName() != null ? user.getFirstName() : "") +
                (user.getLastName() != null ? " " + user.getLastName() : "").trim();

        return new AdminProfileDto(
                fullName,
                user.getEmail(),
                user.getPhone() != null ? user.getPhone() : "",
                user.getRole().name(),
                user.getAvatar() != null ? user.getAvatar() : "A"
        );
    }

    @Override
    public AdminProfileDto updateAdminProfile(String email, AdminProfileDto profileDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Split name into first and last name if needed
        String[] nameParts = profileDto.name().split(" ", 2);
        user.setFirstName(nameParts[0]);
        user.setLastName(nameParts.length > 1 ? nameParts[1] : "");
        user.setPhone(profileDto.phone());
        user.setAvatar(profileDto.avatar());

        userRepository.save(user);

        return getAdminProfile(email);
    }

    @Override
    public void changePassword(String email, ChangePasswordDto passwordDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify current password
        if (!passwordEncoder.matches(passwordDto.currentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect!");
        }

        // Encode and save new password
        user.setPassword(passwordEncoder.encode(passwordDto.newPassword()));
        userRepository.save(user);
    }
}