package com.eventqr.attendance.dto;

import java.time.LocalDateTime;

public class EventResponse {
    private Long id;
    private String eventName;
    private String eventPlace;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String attendanceMode;
    private String qrToken;
    private long totalParticipants;
    private long presentCount;
    private long absentCount;

    public EventResponse() {}

    public EventResponse(Long id, String eventName, String eventPlace, LocalDateTime startTime, LocalDateTime endTime, String attendanceMode, String qrToken, long totalParticipants, long presentCount, long absentCount) {
        this.id = id;
        this.eventName = eventName;
        this.eventPlace = eventPlace;
        this.startTime = startTime;
        this.endTime = endTime;
        this.attendanceMode = attendanceMode;
        this.qrToken = qrToken;
        this.totalParticipants = totalParticipants;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
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

    public String getEventPlace() { 
        return eventPlace; 
    }
    
    public void setEventPlace(String eventPlace) { 
        this.eventPlace = eventPlace; 
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

    public String getAttendanceMode() { 
        return attendanceMode; 
    }
    
    public void setAttendanceMode(String attendanceMode) { 
        this.attendanceMode = attendanceMode; 
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

    public static EventResponseBuilder builder() {
        return new EventResponseBuilder();
    }

    public static class EventResponseBuilder {
        private Long id;
        private String eventName;
        private String eventPlace;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String attendanceMode;
        private String qrToken;
        private long totalParticipants;
        private long presentCount;
        private long absentCount;

        public EventResponseBuilder id(Long id) { 
            this.id = id; 
            return this; 
        }
        
        public EventResponseBuilder eventName(String eventName) { 
            this.eventName = eventName; 
            return this; 
        }
        
        public EventResponseBuilder eventPlace(String eventPlace) { 
            this.eventPlace = eventPlace; 
            return this; 
        }
        
        public EventResponseBuilder startTime(LocalDateTime startTime) { 
            this.startTime = startTime; 
            return this; 
        }
        
        public EventResponseBuilder endTime(LocalDateTime endTime) { 
            this.endTime = endTime; 
            return this; 
        }
        
        public EventResponseBuilder attendanceMode(String attendanceMode) { 
            this.attendanceMode = attendanceMode; 
            return this; 
        }
        
        public EventResponseBuilder qrToken(String qrToken) { 
            this.qrToken = qrToken; 
            return this; 
        }
        
        public EventResponseBuilder totalParticipants(long totalParticipants) { 
            this.totalParticipants = totalParticipants; 
            return this; 
        }
        
        public EventResponseBuilder presentCount(long presentCount) { 
            this.presentCount = presentCount; 
            return this; 
        }
        
        public EventResponseBuilder absentCount(long absentCount) { 
            this.absentCount = absentCount; 
            return this; 
        }

        public EventResponse build() {
            return new EventResponse(id, eventName, eventPlace, startTime, endTime, attendanceMode, qrToken, totalParticipants, presentCount, absentCount);
        }
    }
}
