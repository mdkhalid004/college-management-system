package com.cfs.cms.service;

import com.cfs.cms.dto.TimetableDto;
import java.util.List;

public interface TimetableService {
    TimetableDto createTimetable(TimetableDto timetableDto);
    List<TimetableDto> getAllTimetables();
    TimetableDto getTimetableById(Long timetableId);
    TimetableDto updateTimetable(Long timetableId, TimetableDto timetableDto);
    void deleteTimetable(Long timetableId);
}