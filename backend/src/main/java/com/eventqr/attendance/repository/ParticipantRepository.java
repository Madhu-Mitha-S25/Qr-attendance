package com.eventqr.attendance.repository;

import com.eventqr.attendance.entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    Optional<Participant> findByEventIdAndEmailIgnoreCase(Long eventId, String email);
    List<Participant> findByEventId(Long eventId);
    long countByEventId(Long eventId);

    void deleteByEventId(Long eventId);
}
