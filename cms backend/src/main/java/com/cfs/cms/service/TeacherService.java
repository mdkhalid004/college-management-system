package com.cfs.cms.service;

import com.cfs.cms.dto.TeacherDto;
import java.util.List;

public interface TeacherService {
    TeacherDto createTeacher(TeacherDto teacherDto);
    TeacherDto getTeacherById(Long teacherId);
    List<TeacherDto> getAllTeachers();
    TeacherDto updateTeacher(Long teacherId, TeacherDto teacherDto);
    void deleteTeacher(Long teacherId);
}