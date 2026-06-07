package com.eventqr.attendance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AttendanceRequest {
    private String name; // optional for registered mode, mandatory for open

    @NotBlank
    @Email
    private String email;

    private String department; // optional for registered mode, mandatory for open
}
