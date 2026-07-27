package com.cfs.cms.controller;

import com.cfs.cms.dto.FeesDto;
import com.cfs.cms.service.FeesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/fees")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class FeesController {

    private final FeesService feesService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeesDto> createFees(@RequestBody FeesDto feesDto) {
        return new ResponseEntity<>(feesService.createFees(feesDto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<FeesDto>> getAllFees() {
        return ResponseEntity.ok(feesService.getAllFees());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<FeesDto> getFeesById(@PathVariable("id") Long receiptId) {
        return ResponseEntity.ok(feesService.getFeesById(receiptId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeesDto> updateFees(@PathVariable("id") Long receiptId, @RequestBody FeesDto feesDto) {
        return ResponseEntity.ok(feesService.updateFees(receiptId, feesDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteFees(@PathVariable("id") Long receiptId) {
        feesService.deleteFees(receiptId);
        return ResponseEntity.ok("Fees record deleted successfully.");
    }
}