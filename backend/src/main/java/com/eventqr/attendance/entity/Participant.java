package com.eventqr.attendance.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "participants", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "email"})
})
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String department;

    public Participant() {}

    public Participant(Long id, Event event, String name, String email, String department) {
        this.id = id;
        this.event = event;
        this.name = name;
        this.email = email;
        this.department = department;
    }

    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
    }

    public Event getEvent() { 
        return event; 
    }
    
    public void setEvent(Event event) { 
        this.event = event; 
    }

    public String getName() { 
        return name; 
    }
    
    public void setName(String name) { 
        this.name = name; 
    }

    public String getEmail() { 
        return email; 
    }
    
    public void setEmail(String email) { 
        this.email = email; 
    }

    public String getDepartment() { 
        return department; 
    }
    
    public void setDepartment(String department) { 
        this.department = department; 
    }

    public static ParticipantBuilder builder() {
        return new ParticipantBuilder();
    }

    public static class ParticipantBuilder {
        private Long id;
        private Event event;
        private String name;
        private String email;
        private String department;

        public ParticipantBuilder id(Long id) { 
            this.id = id; 
            return this; 
        }
        
        public ParticipantBuilder event(Event event) { 
            this.event = event; 
            return this; 
        }
        
        public ParticipantBuilder name(String name) { 
            this.name = name; 
            return this; 
        }
        
        public ParticipantBuilder email(String email) { 
            this.email = email; 
            return this; 
        }
        
        public ParticipantBuilder department(String department) { 
            this.department = department; 
            return this; 
        }

        public Participant build() {
            return new Participant(id, event, name, email, department);
        }
    }
}
