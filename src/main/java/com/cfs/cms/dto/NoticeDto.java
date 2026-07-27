package com.cfs.cms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class NoticeDto {
    private Long noticeId;
    private String title;
    private String description;
    private LocalDate publishDate;
}