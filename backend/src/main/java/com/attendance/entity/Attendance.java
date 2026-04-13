package com.attendance.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "attendances",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "session_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    /** 'p' = presente, 'a' = ausente, 't' = tardanza, 'j' = justificado */
    @Column(name = "attendance_value", length = 1, nullable = false)
    private String value;
}
