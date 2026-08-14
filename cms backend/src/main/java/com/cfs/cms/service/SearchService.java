package com.cfs.cms.service;

import com.cfs.cms.dto.SearchResultDto;
import com.cfs.cms.entity.*;
import com.cfs.cms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private LibraryRepository libraryRepository;

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private FeesRepository feesRepository;

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    public List<SearchResultDto> globalSearch(String query) {
        List<SearchResultDto> results = new ArrayList<>();

        if (query == null || query.trim().isEmpty()) {
            return results;
        }

        List<Student> students = studentRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEnrollmentNumberContainingIgnoreCase(query, query, query);
        for (Student s : students) {
            results.add(new SearchResultDto(
                    "STUDENT",
                    s.getFirstName() + " " + s.getLastName(),
                    "Enrollment: " + s.getEnrollmentNumber(),
                    "/student"
            ));
        }


        List<Teacher> teachers = teacherRepository.findByNameContainingIgnoreCaseOrSubjectContainingIgnoreCase(query, query);
        for (Teacher t : teachers) {
            results.add(new SearchResultDto(
                    "TEACHER",
                    t.getName(),
                    "Subject: " + (t.getSubject() != null ? t.getSubject() : "N/A"),
                    "/teacher"
            ));
        }


        List<Course> courses = courseRepository.findByNameContainingIgnoreCase(query);
        for (Course c : courses) {
            results.add(new SearchResultDto(
                    "COURSE",
                    c.getName(),
                    "Duration: " + c.getDuration(),
                    "/course"
            ));
        }

        List<Department> departments = departmentRepository.findByNameContainingIgnoreCaseOrHodContainingIgnoreCase(query, query);
        for (Department d : departments) {
            results.add(new SearchResultDto(
                    "DEPARTMENT",
                    d.getName(),
                    "HOD: " + (d.getHod() != null ? d.getHod() : "N/A"),
                    "/department"
            ));
        }


        List<Library> books = libraryRepository.findByNameContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrIsbnContainingIgnoreCase(query, query, query);
        for (Library b : books) {
            results.add(new SearchResultDto(
                    "LIBRARY",
                    b.getName(),
                    "Author: " + b.getAuthor(),
                    "/library"
            ));
        }


        List<Notice> notices = noticeRepository.findByTitleContainingIgnoreCase(query);
        for (Notice n : notices) {
            results.add(new SearchResultDto(
                    "NOTICE",
                    n.getTitle(),
                    "Published: " + n.getPublishDate(),
                    "/notice"
            ));
        }


        List<Exam> exams = examRepository.findByNameContainingIgnoreCase(query);
        for (Exam e : exams) {
            results.add(new SearchResultDto(
                    "EXAM",
                    e.getName(),
                    "Date: " + e.getExamDate(),
                    "/exam"
            ));
        }


        List<Event> events = eventRepository.findByEventNameContainingIgnoreCase(query);
        for (Event ev : events) {
            results.add(new SearchResultDto(
                    "EVENT",
                    ev.getEventName(),
                    "Venue: " + ev.getVenue(),
                    "/event"
            ));
        }


        List<Fees> feesList = feesRepository.findByReceiptNoContainingIgnoreCase(query);
        for (Fees f : feesList) {
            results.add(new SearchResultDto(
                    "FEES",
                    "Receipt: " + f.getReceiptNo(),
                    "Paid: ₹" + f.getPaidAmount(),
                    "/fees"
            ));
        }


        List<Result> resultList = resultRepository.findByGradeContainingIgnoreCaseOrStatusContainingIgnoreCase(query, query);
        for (Result r : resultList) {
            results.add(new SearchResultDto(
                    "RESULT",
                    "Grade: " + r.getGrade(),
                    "Status: " + r.getStatus() + " (Marks: " + r.getMarks() + ")",
                    "/result"
            ));
        }


        List<Timetable> timetables = timetableRepository.findByDayOfWeekContainingIgnoreCaseOrRoomNumberContainingIgnoreCase(query, query);
        for (Timetable tt : timetables) {
            results.add(new SearchResultDto(
                    "TIMETABLE",
                    "Day: " + tt.getDayOfWeek(),
                    "Room: " + tt.getRoomNumber() + " | Time: " + tt.getClassTime(),
                    "/timetable"
            ));
        }

        return results;
    }
}