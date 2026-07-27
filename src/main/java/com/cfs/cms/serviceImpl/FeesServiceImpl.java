package com.cfs.cms.serviceImpl;

import com.cfs.cms.dto.FeesDto;
import com.cfs.cms.entity.Fees;
import com.cfs.cms.enums.PaymentMode;
import com.cfs.cms.entity.Student;
import com.cfs.cms.repository.FeesRepository;
import com.cfs.cms.repository.StudentRepository;
import com.cfs.cms.service.FeesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeesServiceImpl implements FeesService {

    private final FeesRepository feesRepository;
    private final StudentRepository studentRepository;

    @Override
    public FeesDto createFees(FeesDto feesDto) {
        Student student = studentRepository.findById(feesDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Fees fees = new Fees();
        fees.setReceiptNo(feesDto.getReceiptNo());
        fees.setStudent(student);
        fees.setTotalFees(feesDto.getTotalFees());
        fees.setPaidAmount(feesDto.getPaidAmount());

        Double calculatedDue = feesDto.getTotalFees() - feesDto.getPaidAmount();
        fees.setDueAmount(calculatedDue);

        fees.setPaymentDate(feesDto.getPaymentDate());
        fees.setPaymentMode(PaymentMode.valueOf(feesDto.getPaymentMode().toUpperCase()));
        fees.setTransactionId(feesDto.getTransactionId());

        Fees savedFees = feesRepository.save(fees);
        return mapToDto(savedFees);
    }

    @Override
    public List<FeesDto> getAllFees() {
        return feesRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public FeesDto getFeesById(Long receiptId) {
        Fees fees = feesRepository.findById(receiptId)
                .orElseThrow(() -> new RuntimeException("Fees record not found"));
        return mapToDto(fees);
    }

    @Override
    public FeesDto updateFees(Long receiptId, FeesDto feesDto) {
        Fees fees = feesRepository.findById(receiptId)
                .orElseThrow(() -> new RuntimeException("Fees record not found"));

        Student student = studentRepository.findById(feesDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        fees.setReceiptNo(feesDto.getReceiptNo());
        fees.setStudent(student);
        fees.setTotalFees(feesDto.getTotalFees());
        fees.setPaidAmount(feesDto.getPaidAmount());

        Double calculatedDue = feesDto.getTotalFees() - feesDto.getPaidAmount();
        fees.setDueAmount(calculatedDue);

        fees.setPaymentDate(feesDto.getPaymentDate());
        fees.setPaymentMode(PaymentMode.valueOf(feesDto.getPaymentMode().toUpperCase()));
        fees.setTransactionId(feesDto.getTransactionId());

        Fees updatedFees = feesRepository.save(fees);
        return mapToDto(updatedFees);
    }

    @Override
    public void deleteFees(Long receiptId) {
        feesRepository.deleteById(receiptId);
    }

    private FeesDto mapToDto(Fees fees) {
        FeesDto dto = new FeesDto();
        dto.setReceiptId(fees.getReceiptId());
        dto.setReceiptNo(fees.getReceiptNo());
        dto.setStudentId(fees.getStudent().getStudentId());
        dto.setTotalFees(fees.getTotalFees());
        dto.setPaidAmount(fees.getPaidAmount());
        dto.setDueAmount(fees.getDueAmount());
        dto.setPaymentDate(fees.getPaymentDate());
        dto.setPaymentMode(fees.getPaymentMode().name());
        dto.setTransactionId(fees.getTransactionId());
        return dto;
    }
}