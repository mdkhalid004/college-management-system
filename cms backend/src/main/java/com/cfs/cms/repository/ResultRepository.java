package com.cfs.cms.repository;

import com.cfs.cms.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByGradeContainingIgnoreCaseOrStatusContainingIgnoreCase(String grade, String status);
}