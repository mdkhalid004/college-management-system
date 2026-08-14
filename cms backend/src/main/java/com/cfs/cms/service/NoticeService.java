package com.cfs.cms.service;

import com.cfs.cms.dto.NoticeDto;
import java.util.List;

public interface NoticeService {
    NoticeDto createNotice(NoticeDto noticeDto);
    List<NoticeDto> getAllNotices();
    NoticeDto getNoticeById(Long noticeId);
    NoticeDto updateNotice(Long noticeId, NoticeDto noticeDto);
    void deleteNotice(Long noticeId);
}