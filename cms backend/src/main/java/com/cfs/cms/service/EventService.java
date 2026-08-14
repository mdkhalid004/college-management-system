package com.cfs.cms.service;

import com.cfs.cms.dto.EventDto;
import java.util.List;

public interface EventService {
    EventDto createEvent(EventDto eventDto);
    List<EventDto> getAllEvents();
    EventDto getEventById(Long eventId);
    EventDto updateEvent(Long eventId, EventDto eventDto);
    void deleteEvent(Long eventId);
}