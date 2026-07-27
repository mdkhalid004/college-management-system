package com.cfs.cms.controller;
import com.cfs.cms.dto.MonthlyDataDto;
import java.util.List;
import com.cfs.cms.dto.RecentActivityDto;
import java.util.Map;

import com.cfs.cms.dto.DashboardDto;

import com.cfs.cms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<DashboardDto> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    // For Fees Chart
    @GetMapping("/monthly-fees")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<MonthlyDataDto>> getMonthlyFeesData() {
        return ResponseEntity.ok(dashboardService.getMonthlyFeesData());
    }

    // For Attendance Chart
    @GetMapping("/monthly-attendance")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<MonthlyDataDto>> getMonthlyAttendanceData() {
        return ResponseEntity.ok(dashboardService.getMonthlyAttendanceData());
    }

    @GetMapping("/recent-activities")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<List<RecentActivityDto>> getRecentActivities() {
        return ResponseEntity.ok(dashboardService.getRecentActivities());
    }

    @GetMapping("/notifications/count")
    public ResponseEntity<Integer> getNotificationCount() {
        int count = dashboardService.getNotificationCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> globalSearch(@RequestParam("query") String query) {
        Map<String, Object> results = dashboardService.globalSearch(query);
        return ResponseEntity.ok(results);
    }

}