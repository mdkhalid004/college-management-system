package com.cfs.cms.controller;

import com.cfs.cms.dto.StudentDto;
import com.cfs.cms.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    // Constructor injection for Spring Boot 4.1.0 compatibility
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // API to add a new student
    @PostMapping
    public ResponseEntity<?> addStudent(@RequestBody StudentDto studentDto) {
        try {
            StudentDto savedStudent = studentService.addStudent(studentDto);
            return new ResponseEntity<>(savedStudent, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // API to get a list of all students
    @GetMapping
    public ResponseEntity<List<StudentDto>> getAllStudents() {
        List<StudentDto> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // API to get a specific student by enrollment number
    @GetMapping("/{enrollmentNumber}")
    public ResponseEntity<?> getStudentByEnrollmentNumber(@PathVariable String enrollmentNumber) {
        try {
            StudentDto student = studentService.getStudentByEnrollmentNumber(enrollmentNumber);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}