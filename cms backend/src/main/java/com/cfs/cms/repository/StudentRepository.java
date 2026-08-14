package com.cfs.cms.repository;

import com.cfs.cms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {


    Optional<Student> findByEnrollmentNumber(String enrollmentNumber);

    List<Student> findTop2ByOrderByStudentIdDesc();
    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);


    List<Student> findByFirstNameContainingIgnoreCase(String firstName);

    List<Student> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEnrollmentNumberContainingIgnoreCase(String query, String query1, String query2);
}