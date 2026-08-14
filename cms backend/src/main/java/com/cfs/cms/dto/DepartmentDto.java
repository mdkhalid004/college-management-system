package com.cfs.cms.dto;

/**
 * A Java Record acting as a Data Transfer Object (DTO) for Department entity.
 */
public record DepartmentDto(
        Long departmentId,
        String name,
        String hod,
        Integer totalTeachers,
        Integer totalStudents
) {
}