package com.cfs.cms.serviceImpl;

import com.cfs.cms.dto.NoticeDto;
import com.cfs.cms.entity.Notice;
import com.cfs.cms.repository.NoticeRepository;
import com.cfs.cms.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;

    @Override
    public NoticeDto createNotice(NoticeDto noticeDto) {
        Notice notice = new Notice();
        notice.setTitle(noticeDto.getTitle());
        notice.setDescription(noticeDto.getDescription());
        notice.setPublishDate(noticeDto.getPublishDate());

        Notice savedNotice = noticeRepository.save(notice);
        return mapToDto(savedNotice);
    }

    @Override
    public List<NoticeDto> getAllNotices() {
        return noticeRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public NoticeDto getNoticeById(Long noticeId) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("Notice not found"));
        return mapToDto(notice);
    }

    @Override
    public NoticeDto updateNotice(Long noticeId, NoticeDto noticeDto) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new RuntimeException("Notice not found"));

        notice.setTitle(noticeDto.getTitle());
        notice.setDescription(noticeDto.getDescription());
        notice.setPublishDate(noticeDto.getPublishDate());

        Notice updatedNotice = noticeRepository.save(notice);
        return mapToDto(updatedNotice);
    }

    @Override
    public void deleteNotice(Long noticeId) {
        noticeRepository.deleteById(noticeId);
    }

    private NoticeDto mapToDto(Notice notice) {
        NoticeDto dto = new NoticeDto();
        dto.setNoticeId(notice.getNoticeId());
        dto.setTitle(notice.getTitle());
        dto.setDescription(notice.getDescription());
        dto.setPublishDate(notice.getPublishDate());
        return dto;
    }
}