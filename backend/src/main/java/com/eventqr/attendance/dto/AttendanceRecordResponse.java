package com.eventqr.attendance.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AttendanceRecordResponse {
    private Long id;
    private String name;
    private String email;
    private String department;
    private LocalDateTime attendanceTime;
    private boolean present;
}
