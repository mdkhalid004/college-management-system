package com.cfs.cms.repository;

import com.cfs.cms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

     List<Course> findByDepartmentDepartmentId(Long departmentId);
}