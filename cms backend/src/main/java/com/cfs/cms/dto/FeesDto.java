package com.cfs.cms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class FeesDto {
    private Long receiptId;
    private String receiptNo;
    private Long studentId;
    private String studentName;
    private Double totalFees;
    private Double paidAmount;
    private Double dueAmount;
    private LocalDate paymentDate;
    private String paymentMode;
    private String transactionId;
}