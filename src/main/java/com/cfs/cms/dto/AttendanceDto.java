package com.cfs.cms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AttendanceDto {
    private Long attendanceId;
    private Long studentId;
    private Long courseId;
    private LocalDate date;
    private String status;
}