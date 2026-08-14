package com.cfs.cms.dto;

import com.cfs.cms.enums.FeeStatus;
import com.cfs.cms.enums.Gender;

import java.time.LocalDate;

public record StudentDto(

        Long studentId,

        String enrollmentNumber,

        String firstName,

        String lastName,

        String fatherName,

        String motherName,

        Gender gender,

        LocalDate dob,

        String mobile,

        String address,

        Long departmentId,
        String departmentName,

        Long courseId,
        String courseName,

        Integer semester,

        LocalDate admissionDate,

        FeeStatus feeStatus,

        String photo

) {
}