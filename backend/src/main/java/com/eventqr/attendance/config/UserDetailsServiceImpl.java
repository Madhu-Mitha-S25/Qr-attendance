package com.eventqr.attendance.config;

import com.eventqr.attendance.entity.Faculty;
import com.eventqr.attendance.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    private FacultyRepository facultyRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Faculty faculty = facultyRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Faculty not found with email: " + email));

        return UserDetailsImpl.build(faculty);
    }
}
