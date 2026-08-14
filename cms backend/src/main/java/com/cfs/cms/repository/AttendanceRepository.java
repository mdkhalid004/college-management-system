package com.cfs.cms.repository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import com.cfs.cms.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    @Query("SELECT MONTHNAME(a.date), COUNT(a) FROM Attendance a WHERE a.status = 'PRESENT' GROUP BY MONTHNAME(a.date), MONTH(a.date) ORDER BY MONTH(a.date)")
    List<Object[]> getMonthlyPresentCount();
}