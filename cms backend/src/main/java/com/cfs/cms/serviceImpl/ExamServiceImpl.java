package com.cfs.cms.serviceImpl;

import com.cfs.cms.exception.ResourceNotFoundException;
import com.cfs.cms.dto.ExamDto;
import com.cfs.cms.entity.Course;
import com.cfs.cms.entity.Exam;
import com.cfs.cms.repository.CourseRepository;
import com.cfs.cms.repository.ExamRepository;
import com.cfs.cms.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final CourseRepository courseRepository;

    @Override
    public ExamDto createExam(ExamDto examDto) {
        Course course = courseRepository.findById(examDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Exam exam = new Exam();
        exam.setName(examDto.getName());
        exam.setCourse(course);
        exam.setExamDate(examDto.getExamDate());
        exam.setExamTime(examDto.getExamTime());
        exam.setRoomNumber(examDto.getRoomNumber());

        Exam savedExam = examRepository.save(exam);
        return mapToDto(savedExam);
    }

    @Override
    public List<ExamDto> getAllExams() {
        return examRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ExamDto getExamById(Long examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));
        return mapToDto(exam);
    }

    @Override
    public ExamDto updateExam(Long examId, ExamDto examDto) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Exam not found"));

        Course course = courseRepository.findById(examDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        exam.setName(examDto.getName());
        exam.setCourse(course);
        exam.setExamDate(examDto.getExamDate());
        exam.setExamTime(examDto.getExamTime());
        exam.setRoomNumber(examDto.getRoomNumber());

        Exam updatedExam = examRepository.save(exam);
        return mapToDto(updatedExam);
    }

    @Override
    public void deleteExam(Long examId) {
        examRepository.deleteById(examId);
    }

    private ExamDto mapToDto(Exam exam) {
        ExamDto dto = new ExamDto();
        dto.setExamId(exam.getExamId());
        dto.setName(exam.getName());

        if (exam.getCourse() != null) {
            dto.setCourseId(exam.getCourse().getCourseId());
            dto.setCourseName(exam.getCourse().getName());
        }

        dto.setExamDate(exam.getExamDate());
        dto.setExamTime(exam.getExamTime());
        dto.setRoomNumber(exam.getRoomNumber());
        return dto;
    }
}