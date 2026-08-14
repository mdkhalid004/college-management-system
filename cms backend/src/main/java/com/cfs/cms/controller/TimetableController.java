package com.cfs.cms.controller;

import com.cfs.cms.dto.TimetableDto;
import com.cfs.cms.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/timetable")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class TimetableController {

    private final TimetableService timetableService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TimetableDto> createTimetable(@RequestBody TimetableDto timetableDto) {
        return new ResponseEntity<>(timetableService.createTimetable(timetableDto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<TimetableDto>> getAllTimetables() {
        return ResponseEntity.ok(timetableService.getAllTimetables());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<TimetableDto> getTimetableById(@PathVariable("id") Long timetableId) {
        return ResponseEntity.ok(timetableService.getTimetableById(timetableId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TimetableDto> updateTimetable(@PathVariable("id") Long timetableId, @RequestBody TimetableDto timetableDto) {
        return ResponseEntity.ok(timetableService.updateTimetable(timetableId, timetableDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteTimetable(@PathVariable("id") Long timetableId) {
        timetableService.deleteTimetable(timetableId);
        return ResponseEntity.ok("Timetable record deleted successfully.");
    }
}