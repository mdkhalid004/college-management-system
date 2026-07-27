package com.cfs.cms.dto;

import lombok.Data;
import java.time.LocalTime;

@Data
public class TimetableDto {
    private Long timetableId;
    private Long departmentId;
    private String semester;
    private Long courseId;
    private Long teacherId;
    private String dayOfWeek;
    private LocalTime classTime;
    private String roomNumber;
}