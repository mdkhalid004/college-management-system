package com.cfs.cms.repository;

import com.cfs.cms.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // Agar kisi specific department ke courses nikalne ho to:
    // List<Course> findByDepartmentDepartmentId(Long departmentId);
}