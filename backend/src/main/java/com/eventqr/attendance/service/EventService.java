package com.eventqr.attendance.service;

import com.eventqr.attendance.dto.EventRequest;
import com.eventqr.attendance.dto.EventResponse;
import com.eventqr.attendance.entity.Event;
import com.eventqr.attendance.entity.Faculty;
import com.eventqr.attendance.exception.CustomExceptions;
import com.eventqr.attendance.repository.AttendanceRepository;
import com.eventqr.attendance.repository.EventRepository;
import com.eventqr.attendance.repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Transactional
    public Event createEvent(EventRequest request, Faculty faculty) {
        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new CustomExceptions.EventExpiredException("End time must be after start time!");
        }

        Event event = Event.builder()
                .faculty(faculty)
                .eventName(request.getEventName())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .attendanceMode(request.getAttendanceMode().toUpperCase())
                .qrToken(UUID.randomUUID().toString())
                .build();

        return eventRepository.save(event);
    }

    public List<EventResponse> getFacultyEvents(Long facultyId) {
        List<Event> events = eventRepository.findByFacultyIdOrderByStartTimeDesc(facultyId);
        return events.stream().map(this::mapToEventResponse).collect(Collectors.toList());
    }

    public Event getEventByToken(String qrToken) {
        return eventRepository.findByQrToken(qrToken)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Event not found with QR token: " + qrToken));
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.ResourceNotFoundException("Event not found with ID: " + id));
    }

    public EventResponse mapToEventResponse(Event event) {
        long totalParticipants = participantRepository.countByEventId(event.getId());
        long presentCount = attendanceRepository.countByEventId(event.getId());
        long absentCount = 0;
        
        if ("REGISTERED".equals(event.getAttendanceMode())) {
            absentCount = Math.max(0, totalParticipants - presentCount);
        }

        return EventResponse.builder()
                .id(event.getId())
                .eventName(event.getEventName())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .attendanceMode(event.getAttendanceMode())
                .qrToken(event.getQrToken())
                .totalParticipants(totalParticipants)
                .presentCount(presentCount)
                .absentCount(absentCount)
                .build();
    }
}
