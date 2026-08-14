package com.cfs.cms.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ExamDto {
    private Long examId;
    private String name;
    private Long courseId;
    private String courseName; // 👈 Added course name field
    private LocalDate examDate;
    private LocalTime examTime;
    private String roomNumber;
}