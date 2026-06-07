package com.eventqr.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class EventRequest {
    @NotBlank
    private String eventName;

    private String eventPlace;

    @NotNull
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;

    @NotBlank
    private String attendanceMode; // "REGISTERED" or "OPEN"

    public EventRequest() {}

    public EventRequest(String eventName, String eventPlace, LocalDateTime startTime, LocalDateTime endTime, String attendanceMode) {
        this.eventName = eventName;
        this.eventPlace = eventPlace;
        this.startTime = startTime;
        this.endTime = endTime;
        this.attendanceMode = attendanceMode;
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
}
