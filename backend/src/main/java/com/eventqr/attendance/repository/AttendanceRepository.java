package com.eventqr.attendance.repository;

import com.eventqr.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    boolean existsByEventIdAndParticipantId(Long eventId, Long participantId);
    
    long countByEventId(Long eventId);
    
    @Query("SELECT a FROM Attendance a JOIN FETCH a.participant p WHERE a.event.id = :eventId ORDER BY a.attendanceTime DESC")
    List<Attendance> findByEventIdEager(@Param("eventId") Long eventId);
}
