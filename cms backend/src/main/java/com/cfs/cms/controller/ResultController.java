package com.cfs.cms.controller;

import com.cfs.cms.dto.ResultDto;
import com.cfs.cms.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/results")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ResultController {

    private final ResultService resultService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResultDto> createResult(@RequestBody ResultDto resultDto) {
        return new ResponseEntity<>(resultService.createResult(resultDto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<ResultDto>> getAllResults() {
        return ResponseEntity.ok(resultService.getAllResults());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ResultDto> getResultById(@PathVariable("id") Long resultId) {
        return ResponseEntity.ok(resultService.getResultById(resultId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResultDto> updateResult(@PathVariable("id") Long resultId, @RequestBody ResultDto resultDto) {
        return ResponseEntity.ok(resultService.updateResult(resultId, resultDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteResult(@PathVariable("id") Long resultId) {
        resultService.deleteResult(resultId);
        return ResponseEntity.ok("Result deleted successfully.");
    }
}