package com.attendance.repository;

import com.attendance.entity.Justification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface JustificationRepository extends JpaRepository<Justification, Long> {
    List<Justification> findByCourseId(Long courseId);
    Optional<Justification> findByStudentIdAndSessionId(Long studentId, Long sessionId);
    void deleteByStudentIdAndSessionId(Long studentId, Long sessionId);
}
