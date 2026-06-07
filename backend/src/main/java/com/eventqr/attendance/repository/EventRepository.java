package com.eventqr.attendance.repository;

import com.eventqr.attendance.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    Optional<Event> findByQrToken(String qrToken);
    List<Event> findByFacultyIdOrderByStartTimeDesc(Long facultyId);
}
