package com.cfs.cms.service;

import com.cfs.cms.dto.ExamDto;
import java.util.List;

public interface ExamService {
    ExamDto createExam(ExamDto examDto);
    List<ExamDto> getAllExams();
    ExamDto getExamById(Long examId);
    ExamDto updateExam(Long examId, ExamDto examDto);
    void deleteExam(Long examId);
}