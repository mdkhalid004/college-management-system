package com.cfs.cms.repository;

import com.cfs.cms.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;


public interface EventRepository extends JpaRepository<Event, Long> {


    List<Event> findTop3ByEventDateAfterOrderByEventDateAsc(LocalDateTime currentDate);
}