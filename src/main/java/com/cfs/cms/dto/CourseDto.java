package com.cfs.cms.dto;

/**
 * A Java Record acting as a Data Transfer Object (DTO) for Course entity.
 */
public record CourseDto(
        Long courseId,
        String name,
        Long departmentId,
        String departmentName,
        String duration,
        Double totalFees
) {
}