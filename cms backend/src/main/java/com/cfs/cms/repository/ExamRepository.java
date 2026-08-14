package com.cfs.cms.repository;

import com.cfs.cms.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    List<Exam> findByNameContainingIgnoreCase(String name);
}