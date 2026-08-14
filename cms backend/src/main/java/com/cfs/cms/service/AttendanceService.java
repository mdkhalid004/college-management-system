package com.cfs.cms.service;

import com.cfs.cms.dto.AttendanceDto;
import java.util.List;

public interface AttendanceService {
    AttendanceDto createAttendance(AttendanceDto attendanceDto);
    List<AttendanceDto> getAllAttendances();
    AttendanceDto getAttendanceById(Long attendanceId);
    AttendanceDto updateAttendance(Long attendanceId, AttendanceDto attendanceDto);
    void deleteAttendance(Long attendanceId);
}