package com.cfs.cms.dto;

import java.time.LocalDate;

/**
 * A Java Record acting as a Data Transfer Object (DTO) for Teacher entity.
 */
public record TeacherDto(
        Long teacherId,
        Long userId,
        String name,
        String phone,
        Long departmentId,
        String departmentName,
        String subject,
        String qualification,
        Double salary,
        LocalDate joiningDate,
        String address
) {
}