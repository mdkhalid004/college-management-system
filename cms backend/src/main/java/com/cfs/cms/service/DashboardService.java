package com.cfs.cms.service;
import java.util.List;
import java.util.Map;

import com.cfs.cms.dto.DashboardDto;
import com.cfs.cms.dto.MonthlyDataDto;
import com.cfs.cms.dto.RecentActivityDto;
import com.cfs.cms.dto.UpcomingEventDto;

public interface DashboardService {
    DashboardDto getDashboardStats();
    List<MonthlyDataDto> getMonthlyFeesData();
    List<MonthlyDataDto> getMonthlyAttendanceData();
    List<RecentActivityDto> getRecentActivities();
    List<UpcomingEventDto> getUpcomingEvents();
    int getNotificationCount();
    Map<String, Object> globalSearch(String query);
}