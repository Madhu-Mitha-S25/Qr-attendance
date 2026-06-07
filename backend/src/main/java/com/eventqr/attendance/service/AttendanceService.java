package com.eventqr.attendance.service;

import com.eventqr.attendance.dto.AttendanceRecordResponse;
import com.eventqr.attendance.dto.AttendanceRequest;
import com.eventqr.attendance.dto.DashboardStats;
import com.eventqr.attendance.entity.Attendance;
import com.eventqr.attendance.entity.Event;
import com.eventqr.attendance.entity.Participant;
import com.eventqr.attendance.exception.CustomExceptions;
import com.eventqr.attendance.repository.AttendanceRepository;
import com.eventqr.attendance.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private EventService eventService;

    @Transactional
    public void markAttendance(String qrToken, AttendanceRequest request) {
        Event event = eventService.getEventByToken(qrToken);
        LocalDateTime now = LocalDateTime.now();

        // 1. Validate Time Window
        if (now.isBefore(event.getStartTime()) || now.isAfter(event.getEndTime())) {
            throw new CustomExceptions.EventExpiredException("Attendance Session Closed");
        }

        String email = request.getEmail().trim().toLowerCase();

        if ("REGISTERED".equalsIgnoreCase(event.getAttendanceMode())) {
            // 2. REGISTERED MODE: Email must exist in pre-uploaded Excel list
            Participant participant = participantRepository.findByEventIdAndEmailIgnoreCase(event.getId(), email)
                    .orElseThrow(() -> new CustomExceptions.ParticipantNotRegisteredException("Participant Not Registered"));

            // 3. Duplicate check
            if (attendanceRepository.existsByEventIdAndParticipantId(event.getId(), participant.getId())) {
                throw new CustomExceptions.DuplicateAttendanceException("Attendance Already Marked");
            }

            Attendance attendance = Attendance.builder()
                    .event(event)
                    .participant(participant)
                    .attendanceTime(now)
                    .build();

            attendanceRepository.save(attendance);

        } else if ("OPEN".equalsIgnoreCase(event.getAttendanceMode())) {
            // 2. OPEN MODE: Create participant if they do not exist
            if (request.getName() == null || request.getName().trim().isEmpty() ||
                    request.getDepartment() == null || request.getDepartment().trim().isEmpty()) {
                throw new CustomExceptions.ExcelProcessingException("Name and Department are required for Open Attendance!");
            }

            Optional<Participant> participantOpt = participantRepository.findByEventIdAndEmailIgnoreCase(event.getId(), email);
            Participant participant;

            if (participantOpt.isPresent()) {
                participant = participantOpt.get();
                // Duplicate check
                if (attendanceRepository.existsByEventIdAndParticipantId(event.getId(), participant.getId())) {
                    throw new CustomExceptions.DuplicateAttendanceException("Attendance Already Marked");
                }
            } else {
                // Register participant dynamically
                participant = Participant.builder()
                        .event(event)
                        .name(request.getName().trim())
                        .email(email)
                        .department(request.getDepartment().trim())
                        .build();
                participant = participantRepository.save(participant);
            }

            Attendance attendance = Attendance.builder()
                    .event(event)
                    .participant(participant)
                    .attendanceTime(now)
                    .build();

            attendanceRepository.save(attendance);
        }
    }

    public DashboardStats getDashboardStats(Long eventId) {
        Event event = eventService.getEventById(eventId);
        List<Participant> allParticipants = participantRepository.findByEventId(eventId);
        List<Attendance> attendances = attendanceRepository.findByEventIdEager(eventId);

        Map<Long, Attendance> attendanceMap = attendances.stream()
                .collect(Collectors.toMap(a -> a.getParticipant().getId(), a -> a, (a1, a2) -> a1));

        List<AttendanceRecordResponse> records = new ArrayList<>();
        long presentCount = attendances.size();
        long totalCount = allParticipants.size();
        long absentCount = 0;

        if ("REGISTERED".equalsIgnoreCase(event.getAttendanceMode())) {
            absentCount = Math.max(0, totalCount - presentCount);

            // In Registered mode, list all pre-registered students showing their status
            for (Participant p : allParticipants) {
                Attendance att = attendanceMap.get(p.getId());
                records.add(AttendanceRecordResponse.builder()
                        .id(att != null ? att.getId() : null)
                        .name(p.getName())
                        .email(p.getEmail())
                        .department(p.getDepartment())
                        .attendanceTime(att != null ? att.getAttendanceTime() : null)
                        .present(att != null)
                        .build());
            }

            // Order records: Present students first (newest check-ins first), then absent students alphabetically
            records.sort((r1, r2) -> {
                if (r1.isPresent() && !r2.isPresent()) return -1;
                if (!r1.isPresent() && r2.isPresent()) return 1;
                if (r1.isPresent() && r2.isPresent()) {
                    return r2.getAttendanceTime().compareTo(r1.getAttendanceTime());
                }
                return r1.getName().compareToIgnoreCase(r2.getName());
            });

        } else {
            // OPEN MODE: Total is just the count of people who checked in
            totalCount = presentCount;
            absentCount = 0;

            for (Attendance att : attendances) {
                records.add(AttendanceRecordResponse.builder()
                        .id(att.getId())
                        .name(att.getParticipant().getName())
                        .email(att.getParticipant().getEmail())
                        .department(att.getParticipant().getDepartment())
                        .attendanceTime(att.getAttendanceTime())
                        .present(true)
                        .build());
            }
        }

        return DashboardStats.builder()
                .id(event.getId())
                .eventName(event.getEventName())
                .attendanceMode(event.getAttendanceMode())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .qrToken(event.getQrToken())
                .totalParticipants(totalCount)
                .presentCount(presentCount)
                .absentCount(absentCount)
                .records(records)
                .build();
    }
}
