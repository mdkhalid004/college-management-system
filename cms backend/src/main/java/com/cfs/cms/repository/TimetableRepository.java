package com.cfs.cms.repository;

import com.cfs.cms.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByDayOfWeekContainingIgnoreCaseOrRoomNumberContainingIgnoreCase(String dayOfWeek, String roomNumber);
}