package com.cfs.cms.serviceImpl;

import com.cfs.cms.dto.StudentDto;
import com.cfs.cms.entity.Student;
import com.cfs.cms.repository.StudentRepository;
import com.cfs.cms.service.StudentService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    // Constructor-based injection for Spring Boot 4.1.0 compatibility
    public StudentServiceImpl(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public StudentDto addStudent(StudentDto studentDto) {
        // Check if a student with the same enrollment number already exists
        if (studentRepository.findByEnrollmentNumber(studentDto.enrollmentNumber()).isPresent()) {
            throw new RuntimeException("Error: Student with this enrollment number already exists!");
        }

        // Map data from DTO to Entity
        Student student = new Student();
        student.setEnrollmentNumber(studentDto.enrollmentNumber());
        student.setFirstName(studentDto.firstName());
        student.setLastName(studentDto.lastName());
        student.setDepartment(studentDto.department());
        student.setDateOfBirth(studentDto.dateOfBirth());

        // Save the entity to the database
        Student savedStudent = studentRepository.save(student);

        // Convert the saved entity back to DTO and return
        return mapToDto(savedStudent);
    }

    @Override
    public List<StudentDto> getAllStudents() {
        // Fetch all student entities from the database
        List<Student> students = studentRepository.findAll();

        // Convert the list of entities into a list of DTOs using Java Streams
        return students.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public StudentDto getStudentByEnrollmentNumber(String enrollmentNumber) {
        // Fetch student or throw an exception if not found
        Student student = studentRepository.findByEnrollmentNumber(enrollmentNumber)
                .orElseThrow(() -> new RuntimeException("Error: Student not found with enrollment number: " + enrollmentNumber));

        return mapToDto(student);
    }

    /**
     * Helper method to map a Student Entity to a StudentDto Record.
     */
    private StudentDto mapToDto(Student student) {
        return new StudentDto(
                student.getEnrollmentNumber(),
                student.getFirstName(),
                student.getLastName(),
                student.getDepartment(),
                student.getDateOfBirth()
        );
    }
}