package com.cfs.cms.dto;

/**
 * A Java Record acting as a Data Transfer Object (DTO) for Course entity.
 */
public record CourseDto(
        Long courseId,
        String name,
        Long departmentId,      // Input ke liye (Jab naya course banayenge)
        String departmentName,  // Output ke liye (Jab frontend pe list dikhayenge)
        String duration,
        Double totalFees
) {
}