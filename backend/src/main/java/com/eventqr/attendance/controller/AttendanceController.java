package com.eventqr.attendance.controller;

import com.eventqr.attendance.config.UserDetailsImpl;
import com.eventqr.attendance.dto.AttendanceRequest;
import com.eventqr.attendance.dto.DashboardStats;
import com.eventqr.attendance.dto.MessageResponse;
import com.eventqr.attendance.entity.Event;
import com.eventqr.attendance.entity.Participant;
import com.eventqr.attendance.entity.Attendance;
import com.eventqr.attendance.repository.AttendanceRepository;
import com.eventqr.attendance.repository.ParticipantRepository;
import com.eventqr.attendance.service.AttendanceService;
import com.eventqr.attendance.service.EventService;
import com.eventqr.attendance.service.ExcelService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @Autowired
    private EventService eventService;

    @Autowired
    private ExcelService excelService;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @PostMapping("/public/attendance/mark/{qrToken}")
    public ResponseEntity<MessageResponse> markAttendance(
            @PathVariable String qrToken,
            @Valid @RequestBody AttendanceRequest request) {
        attendanceService.markAttendance(qrToken, request);
        return ResponseEntity.ok(new MessageResponse("Attendance Marked Successfully!"));
    }

    @GetMapping("/faculty/attendance/event/{id}")
    public ResponseEntity<DashboardStats> getLiveDashboardStats(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Event event = eventService.getEventById(id);

        if (!event.getFaculty().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        DashboardStats stats = attendanceService.getDashboardStats(id);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/faculty/attendance/event/{id}/export")
    public ResponseEntity<byte[]> exportAttendanceExcel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Event event = eventService.getEventById(id);

        if (!event.getFaculty().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<Participant> participants = participantRepository.findByEventId(id);
        List<Attendance> attendances = attendanceRepository.findByEventIdEager(id);

        byte[] excelData = excelService.exportAttendanceReport(event, participants, attendances);
        String fileName = event.getEventName().replaceAll("[^a-zA-Z0-9-_]", "_") + "_attendance.xlsx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excelData);
    }
}
