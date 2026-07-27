package com.cfs.cms.controller;

import com.cfs.cms.dto.LibraryDto;
import com.cfs.cms.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/library")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class LibraryController {

    private final LibraryService libraryService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LibraryDto> createLibraryRecord(@RequestBody LibraryDto libraryDto) {
        return new ResponseEntity<>(libraryService.createLibraryRecord(libraryDto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<LibraryDto>> getAllLibraryRecords() {
        return ResponseEntity.ok(libraryService.getAllLibraryRecords());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<LibraryDto> getLibraryRecordById(@PathVariable("id") Long bookId) {
        return ResponseEntity.ok(libraryService.getLibraryRecordById(bookId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LibraryDto> updateLibraryRecord(@PathVariable("id") Long bookId, @RequestBody LibraryDto libraryDto) {
        return ResponseEntity.ok(libraryService.updateLibraryRecord(bookId, libraryDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteLibraryRecord(@PathVariable("id") Long bookId) {
        libraryService.deleteLibraryRecord(bookId);
        return ResponseEntity.ok("Library record deleted successfully.");
    }
}