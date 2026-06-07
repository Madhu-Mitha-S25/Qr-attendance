package com.eventqr.attendance.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class DashboardStats {
    private Long id;
    private String eventName;
    private String attendanceMode;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String qrToken;
    private long totalParticipants;
    private long presentCount;
    private long absentCount;
    private List<AttendanceRecordResponse> records;
}
