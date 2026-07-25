package com.cfs.cms.dto;

import java.time.LocalDate;

/**
 * A Java Record acting as a Data Transfer Object (DTO) for Student entity.
 * This is lightweight and immutable, perfect for API requests and responses.
 */
public record StudentDto(
        String enrollmentNumber,
        String firstName,
        String lastName,
        String department,
        LocalDate dateOfBirth
) {
}