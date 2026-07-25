package com.cfs.cms.service;

import com.cfs.cms.dto.StudentDto;
import java.util.List;

public interface StudentService {

    // Method to register a new student in the system
    StudentDto addStudent(StudentDto studentDto);

    // Method to fetch a list of all students
    List<StudentDto> getAllStudents();

    // Method to fetch a specific student by their enrollment number
    StudentDto getStudentByEnrollmentNumber(String enrollmentNumber);
}