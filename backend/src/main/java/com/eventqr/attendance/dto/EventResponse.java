package com.eventqr.attendance.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EventResponse {
    private Long id;
    private String eventName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String attendanceMode;
    private String qrToken;
    private long totalParticipants; // Registered count
    private long presentCount;      // Attended count
    private long absentCount;       // (Total - Present) for REGISTERED
}
