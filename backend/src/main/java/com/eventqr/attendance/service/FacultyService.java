package com.eventqr.attendance.service;

import com.eventqr.attendance.config.JwtUtils;
import com.eventqr.attendance.config.UserDetailsImpl;
import com.eventqr.attendance.dto.JwtResponse;
import com.eventqr.attendance.dto.LoginRequest;
import com.eventqr.attendance.dto.RegisterRequest;
import com.eventqr.attendance.entity.Faculty;
import com.eventqr.attendance.exception.CustomExceptions;
import com.eventqr.attendance.repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public void registerFaculty(RegisterRequest request) {
        if (facultyRepository.existsByEmail(request.getEmail())) {
            throw new CustomExceptions.ExcelProcessingException("Email is already in use!");
        }

        Faculty faculty = Faculty.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        facultyRepository.save(faculty);
    }

    public JwtResponse loginFaculty(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        return new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getName(),
                userDetails.getEmail()
        );
    }
}
