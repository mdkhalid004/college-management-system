package com.cfs.cms.serviceImpl;
import com.cfs.cms.exception.ResourceNotFoundException;
import com.cfs.cms.dto.StudentDto;
import com.cfs.cms.entity.Course;
import com.cfs.cms.entity.Department;
import com.cfs.cms.entity.Student;
import com.cfs.cms.repository.CourseRepository;
import com.cfs.cms.repository.DepartmentRepository;
import com.cfs.cms.repository.StudentRepository;
import com.cfs.cms.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;

    @Override
    public StudentDto createStudent(StudentDto dto) {

        Department department = departmentRepository.findById(dto.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Course course = courseRepository.findById(dto.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Student student = Student.builder()
                .enrollmentNumber(dto.enrollmentNumber())
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .fatherName(dto.fatherName())
                .motherName(dto.motherName())
                .gender(dto.gender())
                .dob(dto.dob())
                .mobile(dto.mobile())
                .address(dto.address())
                .department(department)
                .course(course)
                .semester(dto.semester())
                .admissionDate(dto.admissionDate())
                .feeStatus(dto.feeStatus())
                .photo(dto.photo())
                .build();

        Student savedStudent = studentRepository.save(student);

        return mapToDto(savedStudent);
    }

    @Override
    public StudentDto getStudentById(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID : " + studentId));

        return mapToDto(student);
    }

    @Override
    public List<StudentDto> getAllStudents() {

        return studentRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .toList();
    }

    @Override
    public StudentDto updateStudent(Long studentId, StudentDto dto) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID : " + studentId));

        Department department = departmentRepository.findById(dto.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));

        Course course = courseRepository.findById(dto.courseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        student.setEnrollmentNumber(dto.enrollmentNumber());
        student.setFirstName(dto.firstName());
        student.setLastName(dto.lastName());
        student.setFatherName(dto.fatherName());
        student.setMotherName(dto.motherName());
        student.setGender(dto.gender());
        student.setDob(dto.dob());
        student.setMobile(dto.mobile());
        student.setAddress(dto.address());
        student.setDepartment(department);
        student.setCourse(course);
        student.setSemester(dto.semester());
        student.setAdmissionDate(dto.admissionDate());
        student.setFeeStatus(dto.feeStatus());
        student.setPhoto(dto.photo());

        Student updatedStudent = studentRepository.save(student);

        return mapToDto(updatedStudent);
    }

    @Override
    public void deleteStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID : " + studentId));
        studentRepository.delete(student);
    }

    private StudentDto mapToDto(Student student) {

        return new StudentDto(

                student.getStudentId(),

                student.getEnrollmentNumber(),

                student.getFirstName(),

                student.getLastName(),

                student.getFatherName(),

                student.getMotherName(),

                student.getGender(),

                student.getDob(),

                student.getMobile(),

                student.getAddress(),

                student.getDepartment() != null
                        ? student.getDepartment().getDepartmentId()
                        : null,

                student.getDepartment() != null
                        ? student.getDepartment().getName()
                        : null,

                student.getCourse() != null
                        ? student.getCourse().getCourseId()
                        : null,

                student.getCourse() != null
                        ? student.getCourse().getName()
                        : null,

                student.getSemester(),

                student.getAdmissionDate(),

                student.getFeeStatus(),

                student.getPhoto()
        );
    }
}