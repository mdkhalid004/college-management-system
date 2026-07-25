package com.cfs.cms.repository;

import com.cfs.cms.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    // Custom query method to find a student by their unique enrollment number
    Optional<Student> findByEnrollmentNumber(String enrollmentNumber);
}