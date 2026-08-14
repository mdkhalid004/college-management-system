package com.cfs.cms.controller;

import com.cfs.cms.dto.TeacherDto;
import com.cfs.cms.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class TeacherController {

    private final TeacherService teacherService;

    // CREATE
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherDto> createTeacher(@RequestBody TeacherDto teacherDto) {
        TeacherDto response = teacherService.createTeacher(teacherDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // READ (GET BY ID)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<TeacherDto> getTeacherById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(teacherService.getTeacherById(id));
    }

    // READ (GET ALL)
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')") //
    public ResponseEntity<List<TeacherDto>> getAllTeachers() {
        return ResponseEntity.ok(teacherService.getAllTeachers());
    }

    // UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TeacherDto> updateTeacher(@PathVariable("id") Long id, @RequestBody TeacherDto teacherDto) {
        TeacherDto response = teacherService.updateTeacher(id, teacherDto);
        return ResponseEntity.ok(response);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteTeacher(@PathVariable("id") Long id) {
        teacherService.deleteTeacher(id);
        return ResponseEntity.ok("Teacher with ID " + id + " deleted successfully");
    }
}