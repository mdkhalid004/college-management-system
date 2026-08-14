package com.cfs.cms.service;

import com.cfs.cms.dto.FeesDto;
import java.util.List;

public interface FeesService {
    FeesDto createFees(FeesDto feesDto);
    List<FeesDto> getAllFees();
    FeesDto getFeesById(Long receiptId);
    FeesDto updateFees(Long receiptId, FeesDto feesDto);
    void deleteFees(Long receiptId);
}