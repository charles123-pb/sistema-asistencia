package com.attendance.repository;

import com.attendance.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByCourseId(Long courseId);
    Optional<Session> findByIdAndCourseId(Long id, Long courseId);
}
