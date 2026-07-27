package com.cfs.cms.controller;

import com.cfs.cms.dto.ExamDto;
import com.cfs.cms.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/exams")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ExamController {

    private final ExamService examService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExamDto> createExam(@RequestBody ExamDto examDto) {
        return new ResponseEntity<>(examService.createExam(examDto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<ExamDto>> getAllExams() {
        return ResponseEntity.ok(examService.getAllExams());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ExamDto> getExamById(@PathVariable("id") Long examId) {
        return ResponseEntity.ok(examService.getExamById(examId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ExamDto> updateExam(@PathVariable("id") Long examId, @RequestBody ExamDto examDto) {
        return ResponseEntity.ok(examService.updateExam(examId, examDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteExam(@PathVariable("id") Long examId) {
        examService.deleteExam(examId);
        return ResponseEntity.ok("Exam deleted successfully.");
    }
}