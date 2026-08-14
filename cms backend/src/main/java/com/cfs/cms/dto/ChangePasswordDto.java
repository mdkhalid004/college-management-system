package com.cfs.cms.dto;

public record ChangePasswordDto(
        String currentPassword,
        String newPassword
) {}