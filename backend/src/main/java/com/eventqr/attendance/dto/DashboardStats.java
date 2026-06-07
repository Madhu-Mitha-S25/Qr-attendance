package com.eventqr.attendance.dto;

import java.time.LocalDateTime;
import java.util.List;

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

    public DashboardStats() {}

    public DashboardStats(Long id, String eventName, String attendanceMode, LocalDateTime startTime, LocalDateTime endTime, String qrToken, long totalParticipants, long presentCount, long absentCount, List<AttendanceRecordResponse> records) {
        this.id = id;
        this.eventName = eventName;
        this.attendanceMode = attendanceMode;
        this.startTime = startTime;
        this.endTime = endTime;
        this.qrToken = qrToken;
        this.totalParticipants = totalParticipants;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
        this.records = records;
    }

    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public String getEventName() { 
        return eventName; 
    }
    
    public void setEventName(String eventName) { 
        this.eventName = eventName; 
    }

    public String getAttendanceMode() { 
        return attendanceMode; 
    }
    
    public void setAttendanceMode(String attendanceMode) { 
        this.attendanceMode = attendanceMode; 
    }

    public LocalDateTime getStartTime() { 
        return startTime; 
    }
    
    public void setStartTime(LocalDateTime startTime) { 
        this.startTime = startTime; 
    }

    public LocalDateTime getEndTime() { 
        return endTime; 
    }
    
    public void setEndTime(LocalDateTime endTime) { 
        this.endTime = endTime; 
    }

    public String getQrToken() { 
        return qrToken; 
    }
    
    public void setQrToken(String qrToken) { 
        this.qrToken = qrToken; 
    }

    public long getTotalParticipants() { 
        return totalParticipants; 
    }
    
    public void setTotalParticipants(long totalParticipants) { 
        this.totalParticipants = totalParticipants; 
    }

    public long getPresentCount() { 
        return presentCount; 
    }
    
    public void setPresentCount(long presentCount) { 
        this.presentCount = presentCount; 
    }

    public long getAbsentCount() { 
        return absentCount; 
    }
    
    public void setAbsentCount(long absentCount) { 
        this.absentCount = absentCount; 
    }

    public List<AttendanceRecordResponse> getRecords() { 
        return records; 
    }
    
    public void setRecords(List<AttendanceRecordResponse> records) { 
        this.records = records; 
    }

    public static DashboardStatsBuilder builder() {
        return new DashboardStatsBuilder();
    }

    public static class DashboardStatsBuilder {
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

        public DashboardStatsBuilder id(Long id) { 
            this.id = id; 
            return this; 
        }
        
        public DashboardStatsBuilder eventName(String eventName) { 
            this.eventName = eventName; 
            return this; 
        }
        
        public DashboardStatsBuilder attendanceMode(String attendanceMode) { 
            this.attendanceMode = attendanceMode; 
            return this; 
        }
        
        public DashboardStatsBuilder startTime(LocalDateTime startTime) { 
            this.startTime = startTime; 
            return this; 
        }
        
        public DashboardStatsBuilder endTime(LocalDateTime endTime) { 
            this.endTime = endTime; 
            return this; 
        }
        
        public DashboardStatsBuilder qrToken(String qrToken) { 
            this.qrToken = qrToken; 
            return this; 
        }
        
        public DashboardStatsBuilder totalParticipants(long totalParticipants) { 
            this.totalParticipants = totalParticipants; 
            return this; 
        }
        
        public DashboardStatsBuilder presentCount(long presentCount) { 
            this.presentCount = presentCount; 
            return this; 
        }
        
        public DashboardStatsBuilder absentCount(long absentCount) { 
            this.absentCount = absentCount; 
            return this; 
        }
        
        public DashboardStatsBuilder records(List<AttendanceRecordResponse> records) { 
            this.records = records; 
            return this; 
        }

        public DashboardStats build() {
            return new DashboardStats(id, eventName, attendanceMode, startTime, endTime, qrToken, totalParticipants, presentCount, absentCount, records);
        }
    }
}
