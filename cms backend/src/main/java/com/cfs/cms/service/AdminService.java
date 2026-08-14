package com.cfs.cms.service;

import com.cfs.cms.dto.AdminProfileDto;
import com.cfs.cms.dto.ChangePasswordDto;

public interface AdminService {
    AdminProfileDto getAdminProfile(String email);
    AdminProfileDto updateAdminProfile(String email, AdminProfileDto profileDto);
    void changePassword(String email, ChangePasswordDto passwordDto);
}