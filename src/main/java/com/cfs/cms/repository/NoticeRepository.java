package com.cfs.cms.repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import com.cfs.cms.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    @Query("SELECT COUNT(n) FROM Notice n WHERE n.publishDate >= :date")
    int countRecentNotices(@Param("date") LocalDate date);

    List<Notice> findTop2ByOrderByNoticeIdDesc();
}