package com.cfs.cms.dto;

import java.time.LocalDate;

/**
 * A Java Record acting as a Data Transfer Object (DTO) for Teacher entity.
 */
public record TeacherDto(
        Long teacherId,
        Long userId,            // Foreign Key input ke liye
        String name,
        String phone,
        Long departmentId,      // Foreign Key input ke liye
        String departmentName,  // Frontend par show karne ke liye
        String subject,
        String qualification,
        Double salary,
        LocalDate joiningDate,
        String address
) {
}