package com.cfs.cms.dto;

public record AdminProfileDto(
        String name,
        String email,
        String phone,
        String role,
        String avatar
) {}