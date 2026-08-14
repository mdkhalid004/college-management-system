package com.cfs.cms.serviceImpl;

import com.cfs.cms.exception.ResourceNotFoundException;
import com.cfs.cms.dto.TimetableDto;
import com.cfs.cms.entity.Course;
import com.cfs.cms.entity.Department;
import com.cfs.cms.entity.Teacher;
import com.cfs.cms.entity.Timetable;
import com.cfs.cms.repository.CourseRepository;
import com.cfs.cms.repository.DepartmentRepository;
import com.cfs.cms.repository.TeacherRepository;
import com.cfs.cms.repository.TimetableRepository;
import com.cfs.cms.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimetableServiceImpl implements TimetableService {

    private final TimetableRepository timetableRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final TeacherRepository teacherRepository;

    @Override
    public TimetableDto createTimetable(TimetableDto timetableDto) {
        Department department = departmentRepository.findById(timetableDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Course course = courseRepository.findById(timetableDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Teacher teacher = teacherRepository.findById(timetableDto.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        Timetable timetable = new Timetable();
        timetable.setDepartment(department);
        timetable.setSemester(timetableDto.getSemester());
        timetable.setCourse(course);
        timetable.setTeacher(teacher);
        timetable.setDayOfWeek(timetableDto.getDayOfWeek());
        timetable.setClassTime(timetableDto.getClassTime());
        timetable.setRoomNumber(timetableDto.getRoomNumber());

        Timetable savedTimetable = timetableRepository.save(timetable);
        return mapToDto(savedTimetable);
    }

    @Override
    public List<TimetableDto> getAllTimetables() {
        return timetableRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public TimetableDto getTimetableById(Long timetableId) {
        Timetable timetable = timetableRepository.findById(timetableId)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable not found"));
        return mapToDto(timetable);
    }

    @Override
    public TimetableDto updateTimetable(Long timetableId, TimetableDto timetableDto) {
        Timetable timetable = timetableRepository.findById(timetableId)
                .orElseThrow(() -> new ResourceNotFoundException("Timetable not found"));

        Department department = departmentRepository.findById(timetableDto.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Course course = courseRepository.findById(timetableDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Teacher teacher = teacherRepository.findById(timetableDto.getTeacherId())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found"));

        timetable.setDepartment(department);
        timetable.setSemester(timetableDto.getSemester());
        timetable.setCourse(course);
        timetable.setTeacher(teacher);
        timetable.setDayOfWeek(timetableDto.getDayOfWeek());
        timetable.setClassTime(timetableDto.getClassTime());
        timetable.setRoomNumber(timetableDto.getRoomNumber());

        Timetable updatedTimetable = timetableRepository.save(timetable);
        return mapToDto(updatedTimetable);
    }

    @Override
    public void deleteTimetable(Long timetableId) {
        timetableRepository.deleteById(timetableId);
    }

    private TimetableDto mapToDto(Timetable timetable) {
        TimetableDto dto = new TimetableDto();
        dto.setTimetableId(timetable.getTimetableId());

        // Department Mapping with Name
        if (timetable.getDepartment() != null) {
            dto.setDepartmentId(timetable.getDepartment().getDepartmentId());
            dto.setDepartmentName(timetable.getDepartment().getName());
        }

        dto.setSemester(timetable.getSemester());

        // Course Mapping with Name
        if (timetable.getCourse() != null) {
            dto.setCourseId(timetable.getCourse().getCourseId());
            dto.setCourseName(timetable.getCourse().getName());
        }

        // Teacher Mapping with Full Name
        if (timetable.getTeacher() != null) {
            dto.setTeacherId(timetable.getTeacher().getTeacherId());
            dto.setTeacherName(timetable.getTeacher().getName());
        }

        dto.setDayOfWeek(timetable.getDayOfWeek());
        dto.setClassTime(timetable.getClassTime());
        dto.setRoomNumber(timetable.getRoomNumber());

        return dto;
    }
}