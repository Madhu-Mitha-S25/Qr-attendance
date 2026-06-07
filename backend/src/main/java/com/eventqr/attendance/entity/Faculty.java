package com.eventqr.attendance.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "faculties")
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String password;

    public Faculty() {}

    public Faculty(Long id, String name, String email, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
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

    public String getPassword() { 
        return password; 
    }
    
    public void setPassword(String password) { 
        this.password = password; 
    }

    public static FacultyBuilder builder() {
        return new FacultyBuilder();
    }

    public static class FacultyBuilder {
        private Long id;
        private String name;
        private String email;
        private String password;

        public FacultyBuilder id(Long id) { 
            this.id = id; 
            return this; 
        }
        
        public FacultyBuilder name(String name) { 
            this.name = name; 
            return this; 
        }
        
        public FacultyBuilder email(String email) { 
            this.email = email; 
            return this; 
        }
        
        public FacultyBuilder password(String password) { 
            this.password = password; 
            return this; 
        }

        public Faculty build() {
            return new Faculty(id, name, email, password);
        }
    }
}
