package com.attendance.repository;

import com.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByCourseId(Long courseId);
    Optional<Attendance> findByStudentIdAndSessionId(Long studentId, Long sessionId);
    List<Attendance> findBySessionId(Long sessionId);
}
