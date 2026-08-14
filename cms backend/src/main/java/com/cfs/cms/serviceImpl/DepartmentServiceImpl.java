package com.cfs.cms.serviceImpl;
import com.cfs.cms.exception.ResourceNotFoundException;
import com.cfs.cms.dto.DepartmentDto;
import com.cfs.cms.entity.Department;
import com.cfs.cms.repository.DepartmentRepository;
import com.cfs.cms.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    public DepartmentDto createDepartment(DepartmentDto dto) {
        Department department = Department.builder()
                .name(dto.name())
                .hod(dto.hod())
                .totalTeachers(dto.totalTeachers() != null ? dto.totalTeachers() : 0)
                .totalStudents(dto.totalStudents() != null ? dto.totalStudents() : 0)
                .build();

        Department savedDepartment = departmentRepository.save(department);
        return mapToDto(savedDepartment);
    }

    @Override
    public DepartmentDto getDepartmentById(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + departmentId));
        return mapToDto(department);
    }

    @Override
    public List<DepartmentDto> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public DepartmentDto updateDepartment(Long departmentId, DepartmentDto dto) {
        Department existingDepartment = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + departmentId));

        existingDepartment.setName(dto.name());
        existingDepartment.setHod(dto.hod());

        if (dto.totalTeachers() != null) {
            existingDepartment.setTotalTeachers(dto.totalTeachers());
        }
        if (dto.totalStudents() != null) {
            existingDepartment.setTotalStudents(dto.totalStudents());
        }

        Department updatedDepartment = departmentRepository.save(existingDepartment);
        return mapToDto(updatedDepartment);
    }

    @Override
    public void deleteDepartment(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with ID: " + departmentId));
        departmentRepository.delete(department);
    }

    // Helper method: Entity -> Record (DTO)
    private DepartmentDto mapToDto(Department department) {
        return new DepartmentDto(
                department.getDepartmentId(),
                department.getName(),
                department.getHod(),
                department.getTotalTeachers(),
                department.getTotalStudents()
        );
    }
}