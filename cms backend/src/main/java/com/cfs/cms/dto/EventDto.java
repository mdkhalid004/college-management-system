package com.cfs.cms.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class EventDto {
    private Long eventId;
    private String eventName;
    private String description;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private String venue;
}