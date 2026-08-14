package com.cfs.cms.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class TimetableDto {
    private Long timetableId;
    private Long departmentId;
    private String departmentName;
    private String semester;
    private Long courseId;
    private String courseName;
    private Long teacherId;
    private String teacherName;
    private String dayOfWeek;
    private LocalTime classTime;
    private String roomNumber;
}