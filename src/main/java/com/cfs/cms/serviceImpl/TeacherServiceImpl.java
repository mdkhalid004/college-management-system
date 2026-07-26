package com.cfs.cms.serviceImpl;

import com.cfs.cms.dto.TeacherDto;
import com.cfs.cms.entity.Department;
import com.cfs.cms.entity.Teacher;
import com.cfs.cms.entity.User;
import com.cfs.cms.repository.DepartmentRepository;
import com.cfs.cms.repository.TeacherRepository;
import com.cfs.cms.repository.UserRepository;
import com.cfs.cms.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    public TeacherDto createTeacher(TeacherDto dto) {

        // Fetching Foreign Key Entities
        User user = null;
        if (dto.userId() != null) {
            user = userRepository.findById(dto.userId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        Department department = null;
        if (dto.departmentId() != null) {
            department = departmentRepository.findById(dto.departmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
        }

        Teacher teacher = Teacher.builder()
                .user(user)
                .name(dto.name())
                .phone(dto.phone())
                .department(department)
                .subject(dto.subject())
                .qualification(dto.qualification())
                .salary(dto.salary())
                .joiningDate(dto.joiningDate())
                .address(dto.address())
                .build();

        Teacher savedTeacher = teacherRepository.save(teacher);
        return mapToDto(savedTeacher);
    }

    @Override
    public TeacherDto getTeacherById(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teacherId));
        return mapToDto(teacher);
    }

    @Override
    public List<TeacherDto> getAllTeachers() {
        return teacherRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public TeacherDto updateTeacher(Long teacherId, TeacherDto dto) {
        Teacher existingTeacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teacherId));

        existingTeacher.setName(dto.name());
        existingTeacher.setPhone(dto.phone());
        existingTeacher.setSubject(dto.subject());
        existingTeacher.setQualification(dto.qualification());
        existingTeacher.setSalary(dto.salary());
        existingTeacher.setJoiningDate(dto.joiningDate());
        existingTeacher.setAddress(dto.address());

        // Agar department update karna ho
        if (dto.departmentId() != null) {
            Department department = departmentRepository.findById(dto.departmentId())
                    .orElseThrow(() -> new RuntimeException("Department not found"));
            existingTeacher.setDepartment(department);
        }

        Teacher updatedTeacher = teacherRepository.save(existingTeacher);
        return mapToDto(updatedTeacher);
    }

    @Override
    public void deleteTeacher(Long teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teacherId));
        teacherRepository.delete(teacher);
    }

    // Helper method: Entity -> Record (DTO)
    private TeacherDto mapToDto(Teacher teacher) {
        return new TeacherDto(
                teacher.getTeacherId(),
                teacher.getUser() != null ? teacher.getUser().getId() : null,
                teacher.getName(),
                teacher.getPhone(),
                teacher.getDepartment() != null ? teacher.getDepartment().getDepartmentId() : null,
                teacher.getDepartment() != null ? teacher.getDepartment().getName() : null,
                teacher.getSubject(),
                teacher.getQualification(),
                teacher.getSalary(),
                teacher.getJoiningDate(),
                teacher.getAddress()
        );
    }
}