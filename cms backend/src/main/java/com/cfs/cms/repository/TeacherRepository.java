package com.cfs.cms.repository;

import com.cfs.cms.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {

    List<Teacher> findByNameContainingIgnoreCaseOrSubjectContainingIgnoreCase(String name, String subject);
}