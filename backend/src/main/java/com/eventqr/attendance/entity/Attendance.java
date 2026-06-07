package com.eventqr.attendance.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "participant_id"})
})
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "attendance_time", nullable = false)
    private LocalDateTime attendanceTime;

    public Attendance() {}

    public Attendance(Long id, Participant participant, Event event, LocalDateTime attendanceTime) {
        this.id = id;
        this.participant = participant;
        this.event = event;
        this.attendanceTime = attendanceTime;
    }

    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public Participant getParticipant() { 
        return participant; 
    }
    
    public void setParticipant(Participant participant) { 
        this.participant = participant; 
    }

    public Event getEvent() { 
        return event; 
    }
    
    public void setEvent(Event event) { 
        this.event = event; 
    }

    public LocalDateTime getAttendanceTime() { 
        return attendanceTime; 
    }
    
    public void setAttendanceTime(LocalDateTime attendanceTime) { 
        this.attendanceTime = attendanceTime; 
    }

    public static AttendanceBuilder builder() {
        return new AttendanceBuilder();
    }

    public static class AttendanceBuilder {
        private Long id;
        private Participant participant;
        private Event event;
        private LocalDateTime attendanceTime;

        public AttendanceBuilder id(Long id) { 
            this.id = id; 
            return this; 
        }
        
        public AttendanceBuilder participant(Participant participant) { 
            this.participant = participant; 
            return this; 
        }
        
        public AttendanceBuilder event(Event event) { 
            this.event = event; 
            return this; 
        }
        
        public AttendanceBuilder attendanceTime(LocalDateTime attendanceTime) { 
            this.attendanceTime = attendanceTime; 
            return this; 
        }

        public Attendance build() {
            return new Attendance(id, participant, event, attendanceTime);
        }
    }
}
