package com.cfs.cms.controller;

import com.cfs.cms.dto.NoticeDto;
import com.cfs.cms.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notices")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NoticeDto> createNotice(@RequestBody NoticeDto noticeDto) {
        return new ResponseEntity<>(noticeService.createNotice(noticeDto), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<NoticeDto>> getAllNotices() {
        return ResponseEntity.ok(noticeService.getAllNotices());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<NoticeDto> getNoticeById(@PathVariable("id") Long noticeId) {
        return ResponseEntity.ok(noticeService.getNoticeById(noticeId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NoticeDto> updateNotice(@PathVariable("id") Long noticeId, @RequestBody NoticeDto noticeDto) {
        return ResponseEntity.ok(noticeService.updateNotice(noticeId, noticeDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteNotice(@PathVariable("id") Long noticeId) {
        noticeService.deleteNotice(noticeId);
        return ResponseEntity.ok("Notice deleted successfully.");
    }
}