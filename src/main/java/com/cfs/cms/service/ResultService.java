package com.cfs.cms.service;

import com.cfs.cms.dto.ResultDto;
import java.util.List;

public interface ResultService {
    ResultDto createResult(ResultDto resultDto);
    List<ResultDto> getAllResults();
    ResultDto getResultById(Long resultId);
    ResultDto updateResult(Long resultId, ResultDto resultDto);
    void deleteResult(Long resultId);
}