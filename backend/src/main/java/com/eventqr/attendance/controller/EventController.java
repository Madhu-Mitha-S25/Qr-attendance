package com.eventqr.attendance.controller;

import com.eventqr.attendance.config.UserDetailsImpl;
import com.eventqr.attendance.dto.EventRequest;
import com.eventqr.attendance.dto.EventResponse;
import com.eventqr.attendance.dto.MessageResponse;
import com.eventqr.attendance.entity.Event;
import com.eventqr.attendance.entity.Faculty;
import com.eventqr.attendance.exception.CustomExceptions;
import com.eventqr.attendance.repository.FacultyRepository;
import com.eventqr.attendance.service.EventService;
import com.eventqr.attendance.service.ExcelService;
import com.eventqr.attendance.service.QrCodeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class EventController {

    @Autowired
    private EventService eventService;

    @Autowired
    private QrCodeService qrCodeService;

    @Autowired
    private ExcelService excelService;

    @Autowired
    private FacultyRepository facultyRepository;

    private Faculty getFaculty(UserDetailsImpl userDetails) {
        return facultyRepository.findById(userDetails.getId())
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Faculty not found"));
    }

    @PostMapping("/faculty/events")
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Faculty faculty = getFaculty(userDetails);
        Event event = eventService.createEvent(request, faculty);
        return ResponseEntity.ok(eventService.mapToEventResponse(event));
    }

    @GetMapping("/faculty/events")
    public ResponseEntity<List<EventResponse>> getFacultyEvents(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<EventResponse> events = eventService.getFacultyEvents(userDetails.getId());
        return ResponseEntity.ok(events);
    }

    @PutMapping("/faculty/events/{id}")
    public ResponseEntity<?> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Faculty faculty = getFaculty(userDetails);
        Event event = eventService.getEventById(id);
        
        if (!event.getFaculty().getId().equals(faculty.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You are not authorized to edit this event!"));
        }
        
        Event updatedEvent = eventService.updateEvent(event, request);
        return ResponseEntity.ok(eventService.mapToEventResponse(updatedEvent));
    }

    @DeleteMapping("/faculty/events/{id}")
    public ResponseEntity<?> deleteEvent(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Faculty faculty = getFaculty(userDetails);
        Event event = eventService.getEventById(id);
        
        if (!event.getFaculty().getId().equals(faculty.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You are not authorized to delete this event!"));
        }
        
        eventService.deleteEvent(event);
        return ResponseEntity.ok(new MessageResponse("Event deleted successfully!"));
    }

    @GetMapping("/public/events/{qrToken}")
    public ResponseEntity<Map<String, Object>> getPublicEvent(@PathVariable String qrToken) {
        Event event = eventService.getEventByToken(qrToken);
        
        Map<String, Object> details = new HashMap<>();
        details.put("eventName", event.getEventName());
        details.put("eventPlace", event.getEventPlace());
        details.put("startTime", event.getStartTime());
        details.put("endTime", event.getEndTime());
        details.put("attendanceMode", event.getAttendanceMode());
        
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        boolean expired = now.isAfter(event.getEndTime());
        boolean notStarted = now.isBefore(event.getStartTime());
        details.put("expired", expired);
        details.put("notStarted", notStarted);

        return ResponseEntity.ok(details);
    }

    @GetMapping(value = "/public/events/qr/{qrToken}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQrCode(@PathVariable String qrToken) {
        String hostIp;
        try {
            hostIp = java.net.InetAddress.getLocalHost().getHostAddress();
        } catch (Exception e) {
            hostIp = "localhost";
        }
        // The QR code contains the URL to the frontend student attendance page
        String url = "http://" + hostIp + ":5173/attend/" + qrToken;
        byte[] qrImage = qrCodeService.generateQrCodeImage(url, 400, 400);
        return ResponseEntity.ok(qrImage);
    }

    @PostMapping("/faculty/events/{id}/upload")
    public ResponseEntity<MessageResponse> uploadExcel(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Event event = eventService.getEventById(id);
        
        // Ownership check
        if (!event.getFaculty().getId().equals(userDetails.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("You are not authorized to modify this event!"));
        }

        if (!"REGISTERED".equalsIgnoreCase(event.getAttendanceMode())) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Excel template upload is only applicable for REGISTERED attendance mode."));
        }

        excelService.parseParticipantsExcel(file, event);
        return ResponseEntity.ok(new MessageResponse("Excel template uploaded successfully! Participants saved."));
    }
}
