package com.cfs.cms.serviceImpl;

import com.cfs.cms.exception.ResourceNotFoundException;
import com.cfs.cms.dto.AttendanceDto;
import com.cfs.cms.entity.Attendance;
import com.cfs.cms.enums.AttendanceStatus;
import com.cfs.cms.entity.Course;
import com.cfs.cms.entity.Student;
import com.cfs.cms.repository.AttendanceRepository;
import com.cfs.cms.repository.CourseRepository;
import com.cfs.cms.repository.StudentRepository;
import com.cfs.cms.service.AttendanceService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    public AttendanceServiceImpl(AttendanceRepository attendanceRepository, StudentRepository studentRepository, CourseRepository courseRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    public AttendanceDto createAttendance(AttendanceDto attendanceDto) {
        Student student = studentRepository.findById(attendanceDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Course course = courseRepository.findById(attendanceDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setCourse(course);
        attendance.setDate(attendanceDto.getDate());
        attendance.setStatus(AttendanceStatus.valueOf(attendanceDto.getStatus().toUpperCase()));

        Attendance savedAttendance = attendanceRepository.save(attendance);
        return mapToDto(savedAttendance);
    }

    @Override
    public List<AttendanceDto> getAllAttendances() {
        return attendanceRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public AttendanceDto getAttendanceById(Long attendanceId) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found"));
        return mapToDto(attendance);
    }

    @Override
    public AttendanceDto updateAttendance(Long attendanceId, AttendanceDto attendanceDto) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found"));

        Student student = studentRepository.findById(attendanceDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Course course = courseRepository.findById(attendanceDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        attendance.setStudent(student);
        attendance.setCourse(course);
        attendance.setDate(attendanceDto.getDate());
        attendance.setStatus(AttendanceStatus.valueOf(attendanceDto.getStatus().toUpperCase()));

        Attendance updatedAttendance = attendanceRepository.save(attendance);
        return mapToDto(updatedAttendance);
    }

    @Override
    public void deleteAttendance(Long attendanceId) {
        attendanceRepository.deleteById(attendanceId);
    }

    private AttendanceDto mapToDto(Attendance attendance) {
        AttendanceDto dto = new AttendanceDto();
        dto.setAttendanceId(attendance.getAttendanceId());
        dto.setStudentId(attendance.getStudent().getStudentId());

        // 👇 Mapping Student Name (First Name + Last Name)
        if (attendance.getStudent() != null) {
            String firstName = attendance.getStudent().getFirstName() != null ? attendance.getStudent().getFirstName() : "";
            String lastName = attendance.getStudent().getLastName() != null ? attendance.getStudent().getLastName() : "";
            dto.setStudentName((firstName + " " + lastName).trim());
        }

        dto.setCourseId(attendance.getCourse().getCourseId());

        // 👇 Mapping Course Name
        if (attendance.getCourse() != null) {
            dto.setCourseName(attendance.getCourse().getName());
        }

        dto.setDate(attendance.getDate());
        dto.setStatus(attendance.getStatus().name());
        return dto;
    }
}