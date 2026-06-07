package com.eventqr.attendance.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty faculty;

    @Column(name = "event_name", nullable = false, length = 150)
    private String eventName;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "attendance_mode", nullable = false, length = 20)
    private String attendanceMode; // "REGISTERED" or "OPEN"

    @Column(name = "qr_token", nullable = false, unique = true, length = 100)
    private String qrToken;

    public Event() {}

    public Event(Long id, Faculty faculty, String eventName, LocalDateTime startTime, LocalDateTime endTime, String attendanceMode, String qrToken) {
        this.id = id;
        this.faculty = faculty;
        this.eventName = eventName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.attendanceMode = attendanceMode;
        this.qrToken = qrToken;
    }

    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public Faculty getFaculty() { 
        return faculty; 
    }
    
    public void setFaculty(Faculty faculty) { 
        this.faculty = faculty; 
    }

    public String getEventName() { 
        return eventName; 
    }
    
    public void setEventName(String eventName) { 
        this.eventName = eventName; 
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

    public static EventBuilder builder() {
        return new EventBuilder();
    }

    public static class EventBuilder {
        private Long id;
        private Faculty faculty;
        private String eventName;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private String attendanceMode;
        private String qrToken;

        public EventBuilder id(Long id) { 
            this.id = id; 
            return this; 
        }
        
        public EventBuilder faculty(Faculty faculty) { 
            this.faculty = faculty; 
            return this; 
        }
        
        public EventBuilder eventName(String eventName) { 
            this.eventName = eventName; 
            return this; 
        }
        
        public EventBuilder startTime(LocalDateTime startTime) { 
            this.startTime = startTime; 
            return this; 
        }
        
        public EventBuilder endTime(LocalDateTime endTime) { 
            this.endTime = endTime; 
            return this; 
        }
        
        public EventBuilder attendanceMode(String attendanceMode) { 
            this.attendanceMode = attendanceMode; 
            return this; 
        }
        
        public EventBuilder qrToken(String qrToken) { 
            this.qrToken = qrToken; 
            return this; 
        }

        public Event build() {
            return new Event(id, faculty, eventName, startTime, endTime, attendanceMode, qrToken);
        }
    }
}
