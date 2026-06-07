package com.eventqr.attendance.dto;

import java.time.LocalDateTime;

public class AttendanceRecordResponse {
    private Long id;
    private String name;
    private String email;
    private String department;
    private LocalDateTime attendanceTime;
    private boolean present;

    public AttendanceRecordResponse() {}

    public AttendanceRecordResponse(Long id, String name, String email, String department, LocalDateTime attendanceTime, boolean present) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.department = department;
        this.attendanceTime = attendanceTime;
        this.present = present;
    }

    public Long getId() { 
        return id; 
    }
    
    public void setId(Long id) { 
        this.id = id; 
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

    public LocalDateTime getAttendanceTime() { 
        return attendanceTime; 
    }
    
    public void setAttendanceTime(LocalDateTime attendanceTime) { 
        this.attendanceTime = attendanceTime; 
    }

    public boolean isPresent() { 
        return present; 
    }
    
    public void setPresent(boolean present) { 
        this.present = present; 
    }

    public static AttendanceRecordResponseBuilder builder() {
        return new AttendanceRecordResponseBuilder();
    }

    public static class AttendanceRecordResponseBuilder {
        private Long id;
        private String name;
        private String email;
        private String department;
        private LocalDateTime attendanceTime;
        private boolean present;

        public AttendanceRecordResponseBuilder id(Long id) { 
            this.id = id; 
            return this; 
        }
        
        public AttendanceRecordResponseBuilder name(String name) { 
            this.name = name; 
            return this; 
        }
        
        public AttendanceRecordResponseBuilder email(String email) { 
            this.email = email; 
            return this; 
        }
        
        public AttendanceRecordResponseBuilder department(String department) { 
            this.department = department; 
            return this; 
        }
        
        public AttendanceRecordResponseBuilder attendanceTime(LocalDateTime attendanceTime) { 
            this.attendanceTime = attendanceTime; 
            return this; 
        }
        
        public AttendanceRecordResponseBuilder present(boolean present) { 
            this.present = present; 
            return this; 
        }

        public AttendanceRecordResponse build() {
            return new AttendanceRecordResponse(id, name, email, department, attendanceTime, present);
        }
    }
}
