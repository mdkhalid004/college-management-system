package com.cfs.cms.serviceImpl;
import com.cfs.cms.dto.MonthlyDataDto;
import com.cfs.cms.repository.*;
import com.cfs.cms.dto.UpcomingEventDto;
import com.cfs.cms.entity.Event;
import java.time.LocalDate;


import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.cfs.cms.dto.RecentActivityDto;
import com.cfs.cms.entity.Fees;
import com.cfs.cms.entity.Notice;
import com.cfs.cms.entity.Student;
import com.cfs.cms.dto.DashboardDto;
import com.cfs.cms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final FeesRepository feesRepository;
    private final AttendanceRepository attendanceRepository;
    private final NoticeRepository noticeRepository;
    private final EventRepository eventRepository;

    @Override
    public DashboardDto getDashboardStats() {
        DashboardDto dashboardDto = new DashboardDto();
        dashboardDto.setTotalStudents(studentRepository.count());
        dashboardDto.setTotalTeachers(teacherRepository.count());
        dashboardDto.setTotalCourses(courseRepository.count());
        dashboardDto.setTotalDepartments(departmentRepository.count());

        return dashboardDto;
    }

    @Override
    public List<MonthlyDataDto> getMonthlyFeesData() {

        List<Object[]> results = feesRepository.getMonthlyFeesCollection();
        List<MonthlyDataDto> monthlyData = new ArrayList<>();

        for (Object[] result : results) {
            String month = (String) result[0];
            Double totalValue = result[1] != null ? ((Number) result[1]).doubleValue() : 0.0;
            monthlyData.add(new MonthlyDataDto(month, totalValue));
        }
        return monthlyData;
    }

    @Override
    public List<MonthlyDataDto> getMonthlyAttendanceData() {
        List<Object[]> results = attendanceRepository.getMonthlyPresentCount();
        List<MonthlyDataDto> monthlyData = new ArrayList<>();

        for (Object[] result : results) {
            String month = (String) result[0];
            Double totalValue = result[1] != null ? ((Number) result[1]).doubleValue() : 0.0;
            monthlyData.add(new MonthlyDataDto(month, totalValue));
        }
        return monthlyData;
    }

    @Override
    public List<RecentActivityDto> getRecentActivities() {
        List<RecentActivityDto> activities = new ArrayList<>();

        List<Student> recentStudents = studentRepository.findTop2ByOrderByStudentIdDesc();
        for (Student s : recentStudents) {
            activities.add(new RecentActivityDto(
                    "🧑‍🎓",
                    s.getFirstName() + " " + s.getLastName() + " enrolled in " + s.getDepartment().getName(),
                    "Recently Added"
            ));
        }


        List<Fees> recentFees = feesRepository.findTop2ByOrderByReceiptIdDesc();
        for (Fees f : recentFees) {
            activities.add(new RecentActivityDto(
                    "💳",
                    "₹" + f.getPaidAmount() + " fee received (Receipt #" + f.getReceiptNo() + ")",
                    "Recently Paid"
            ));
        }

        List<Notice> recentNotices = noticeRepository.findTop2ByOrderByNoticeIdDesc();
        for (Notice n : recentNotices) {
            activities.add(new RecentActivityDto(
                    "📢",
                    "Notice Published: " + n.getTitle(),
                    n.getPublishDate().toString()
            ));
        }

        return activities;
    }

    @Override
    public List<UpcomingEventDto> getUpcomingEvents() {

        List<Event> events = eventRepository.findTop3ByEventDateAfterOrderByEventDateAsc(LocalDate.now());

        List<UpcomingEventDto> upcomingEvents = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM, yyyy");


        for (Event e : events) {
            String formattedDate = e.getEventDate().format(formatter);

            String locationText = (e.getVenue() != null && !e.getVenue().trim().isEmpty())
                    ? " @ " + e.getVenue()
                    : "";

            String schedule = formattedDate + locationText;

            upcomingEvents.add(new UpcomingEventDto(
                    e.getEventName(),
                    schedule
            ));
        }

        return upcomingEvents;
    }

    @Override
    public int getNotificationCount() {

        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        return noticeRepository.countRecentNotices(sevenDaysAgo);
    }

    @Override
    public Map<String, Object> globalSearch(String query) {
        Map<String, Object> searchResults = new HashMap<>();

        // 1. Search Students
        List<Student> students = studentRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(query, query);
        searchResults.put("students", students);


        List<Fees> fees = feesRepository.findByReceiptNoContainingIgnoreCase(query);
        searchResults.put("fees", fees);

        return searchResults;
    }
}