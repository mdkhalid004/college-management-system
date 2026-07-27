package com.cfs.cms.dto;

import lombok.Data;

@Data
public class ResultDto {
    private Long resultId;
    private Long studentId;
    private Long courseId;
    private Double marks;
    private String grade;
    private String status;
}