package com.cfs.cms.repository;

import com.cfs.cms.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    List<Department> findByNameContainingIgnoreCaseOrHodContainingIgnoreCase(String name, String hod);
}