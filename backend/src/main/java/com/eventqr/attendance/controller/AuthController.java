package com.eventqr.attendance.controller;

import com.eventqr.attendance.dto.JwtResponse;
import com.eventqr.attendance.dto.LoginRequest;
import com.eventqr.attendance.dto.MessageResponse;
import com.eventqr.attendance.dto.RegisterRequest;
import com.eventqr.attendance.service.FacultyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private FacultyService facultyService;

    @PostMapping("/register")
    public ResponseEntity<MessageResponse> registerFaculty(@Valid @RequestBody RegisterRequest request) {
        facultyService.registerFaculty(request);
        return ResponseEntity.ok(new MessageResponse("Faculty registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> loginFaculty(@Valid @RequestBody LoginRequest request) {
        JwtResponse jwtResponse = facultyService.loginFaculty(request);
        return ResponseEntity.ok(jwtResponse);
    }
}
