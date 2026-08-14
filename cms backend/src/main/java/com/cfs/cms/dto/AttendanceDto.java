package com.cfs.cms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AttendanceDto {
    private Long attendanceId;
    private Long studentId;
    private String studentName; // 👈 Added student name field
    private Long courseId;
    private String courseName;  // 👈 Added course name field
    private LocalDate date;
    private String status;
}