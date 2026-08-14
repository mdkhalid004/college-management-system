package com.cfs.cms.repository;

import com.cfs.cms.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.w3c.dom.stylesheets.LinkStyle;

import java.time.LocalDate;
import java.util.List;


public interface EventRepository extends JpaRepository<Event, Long> {

    List<Event> findTop3ByEventDateAfterOrderByEventDateAsc(LocalDate currentDate);

    List<Event> findByEventNameContainingIgnoreCase(String eventName);

}