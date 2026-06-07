package com.eventqr.attendance.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "participants", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "email"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String department;
}
