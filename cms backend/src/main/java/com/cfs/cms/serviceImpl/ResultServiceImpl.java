package com.cfs.cms.serviceImpl;

import com.cfs.cms.exception.ResourceNotFoundException;
import com.cfs.cms.dto.ResultDto;
import com.cfs.cms.entity.Course;
import com.cfs.cms.entity.Result;
import com.cfs.cms.entity.Student;
import com.cfs.cms.repository.CourseRepository;
import com.cfs.cms.repository.ResultRepository;
import com.cfs.cms.repository.StudentRepository;
import com.cfs.cms.service.ResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResultServiceImpl implements ResultService {

    private final ResultRepository resultRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;

    @Override
    public ResultDto createResult(ResultDto resultDto) {
        Student student = studentRepository.findById(resultDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(resultDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        Result result = new Result();
        result.setStudent(student);
        result.setCourse(course);
        result.setMarks(resultDto.getMarks());
        result.setGrade(resultDto.getGrade());
        result.setStatus(resultDto.getStatus());

        Result savedResult = resultRepository.save(result);
        return mapToDto(savedResult);
    }

    @Override
    public List<ResultDto> getAllResults() {
        return resultRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public ResultDto getResultById(Long resultId) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found"));
        return mapToDto(result);
    }

    @Override
    public ResultDto updateResult(Long resultId, ResultDto resultDto) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Result not found"));

        Student student = studentRepository.findById(resultDto.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(resultDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        result.setStudent(student);
        result.setCourse(course);
        result.setMarks(resultDto.getMarks());
        result.setGrade(resultDto.getGrade());
        result.setStatus(resultDto.getStatus());

        Result updatedResult = resultRepository.save(result);
        return mapToDto(updatedResult);
    }

    @Override
    public void deleteResult(Long resultId) {
        resultRepository.deleteById(resultId);
    }

    private ResultDto mapToDto(Result result) {
        ResultDto dto = new ResultDto();
        dto.setResultId(result.getResultId());
        dto.setStudentId(result.getStudent().getStudentId());

        // Student Full Name Mapping
        if (result.getStudent() != null) {
            dto.setStudentName(result.getStudent().getFirstName() + " " + result.getStudent().getLastName());
        }

        dto.setCourseId(result.getCourse().getCourseId());

        // Course Name Mapping
        if (result.getCourse() != null) {
            dto.setCourseName(result.getCourse().getName());
        }

        dto.setMarks(result.getMarks());
        dto.setGrade(result.getGrade());
        dto.setStatus(result.getStatus());
        return dto;
    }
}