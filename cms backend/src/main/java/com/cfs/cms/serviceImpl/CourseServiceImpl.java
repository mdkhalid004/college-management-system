package com.cfs.cms.serviceImpl;
import com.cfs.cms.exception.ResourceNotFoundException;
import com.cfs.cms.dto.CourseDto;
import com.cfs.cms.entity.Course;
import com.cfs.cms.entity.Department;
import com.cfs.cms.repository.CourseRepository;
import com.cfs.cms.repository.DepartmentRepository;
import com.cfs.cms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public CourseDto createCourse(CourseDto dto) {

        // Fetch Department from DB using FK
        Department department = departmentRepository.findById(dto.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + dto.departmentId()));

        Course course = Course.builder()
                .name(dto.name())
                .department(department)
                .duration(dto.duration())
                .totalFees(dto.totalFees())
                .build();

        Course savedCourse = courseRepository.save(course);
        return mapToDto(savedCourse);
    }

    @Override
    public CourseDto getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));
        return mapToDto(course);
    }

    @Override
    public List<CourseDto> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CourseDto updateCourse(Long courseId, CourseDto dto) {
        Course existingCourse = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));

        existingCourse.setName(dto.name());
        existingCourse.setDuration(dto.duration());
        existingCourse.setTotalFees(dto.totalFees());

        // Update department if a new one is provided
        if (dto.departmentId() != null) {
            Department department = departmentRepository.findById(dto.departmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + dto.departmentId()));
            existingCourse.setDepartment(department);
        }

        Course updatedCourse = courseRepository.save(existingCourse);
        return mapToDto(updatedCourse);
    }

    @Override
    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));
        courseRepository.delete(course);
    }

    // Helper method: Entity -> Record (DTO)
    private CourseDto mapToDto(Course course) {
        return new CourseDto(
                course.getCourseId(),
                course.getName(),
                course.getDepartment() != null ? course.getDepartment().getDepartmentId() : null,
                course.getDepartment() != null ? course.getDepartment().getName() : null,
                course.getDuration(),
                course.getTotalFees()
        );
    }
}