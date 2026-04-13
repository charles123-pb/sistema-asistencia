package com.attendance.controller;

import com.attendance.dto.*;
import com.attendance.entity.User;
import com.attendance.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    // ─── CURSOS ───────────────────────────────────────────

    @GetMapping
    public List<CourseDto.CourseResponse> getCourses(@AuthenticationPrincipal User user) {
        return courseService.getCourses(user);
    }

    @GetMapping("/{id}")
    public CourseDto.CourseResponse getCourse(@PathVariable Long id,
                                               @AuthenticationPrincipal User user) {
        return courseService.getCourse(id, user);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDto.CourseResponse createCourse(@Valid @RequestBody CourseDto.CreateCourseRequest req,
                                                  @AuthenticationPrincipal User user) {
        return courseService.createCourse(req, user);
    }

    @PutMapping("/{id}")
    public CourseDto.CourseResponse updateCourse(@PathVariable Long id,
                                                  @RequestBody CourseDto.UpdateCourseRequest req,
                                                  @AuthenticationPrincipal User user) {
        return courseService.updateCourse(id, req, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable Long id, @AuthenticationPrincipal User user) {
        courseService.deleteCourse(id, user);
    }

    // ─── ESTUDIANTES ───────────────────────────────────────

    @GetMapping("/{id}/students")
    public List<StudentDto.StudentResponse> getStudents(@PathVariable Long id,
                                                         @AuthenticationPrincipal User user) {
        return courseService.getStudents(id, user);
    }

    @PostMapping("/{id}/students")
    @ResponseStatus(HttpStatus.CREATED)
    public StudentDto.StudentResponse addStudent(@PathVariable Long id,
                                                  @Valid @RequestBody StudentDto.CreateStudentRequest req,
                                                  @AuthenticationPrincipal User user) {
        return courseService.addStudent(id, req, user);
    }

    @PostMapping("/{id}/students/import")
    public List<StudentDto.StudentResponse> importStudents(@PathVariable Long id,
                                                            @RequestBody StudentDto.ImportStudentsRequest req,
                                                            @AuthenticationPrincipal User user) {
        return courseService.importStudents(id, req, user);
    }

    @PutMapping("/{id}/students/{studentId}")
    public StudentDto.StudentResponse updateStudent(@PathVariable Long id,
                                                     @PathVariable Long studentId,
                                                     @RequestBody StudentDto.UpdateStudentRequest req,
                                                     @AuthenticationPrincipal User user) {
        return courseService.updateStudent(id, studentId, req, user);
    }

    @DeleteMapping("/{id}/students/{studentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeStudent(@PathVariable Long id,
                               @PathVariable Long studentId,
                               @AuthenticationPrincipal User user) {
        courseService.removeStudent(id, studentId, user);
    }

    // ─── SESIONES ──────────────────────────────────────────

    @GetMapping("/{id}/sessions")
    public List<SessionDto.SessionResponse> getSessions(@PathVariable Long id,
                                                         @AuthenticationPrincipal User user) {
        return courseService.getSessions(id, user);
    }

    @PostMapping("/{id}/sessions")
    @ResponseStatus(HttpStatus.CREATED)
    public SessionDto.SessionResponse createSession(@PathVariable Long id,
                                                     @Valid @RequestBody SessionDto.CreateSessionRequest req,
                                                     @AuthenticationPrincipal User user) {
        return courseService.createSession(id, req, user);
    }

    @PutMapping("/{id}/sessions/{sessionId}")
    public SessionDto.SessionResponse updateSession(@PathVariable Long id,
                                                     @PathVariable Long sessionId,
                                                     @RequestBody SessionDto.UpdateSessionRequest req,
                                                     @AuthenticationPrincipal User user) {
        return courseService.updateSession(id, sessionId, req, user);
    }

    @DeleteMapping("/{id}/sessions/{sessionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSession(@PathVariable Long id,
                               @PathVariable Long sessionId,
                               @AuthenticationPrincipal User user) {
        courseService.deleteSession(id, sessionId, user);
    }

    // ─── ASISTENCIA ────────────────────────────────────────

    @GetMapping("/{id}/attendance")
    public Map<String, String> getAttendance(@PathVariable Long id,
                                              @AuthenticationPrincipal User user) {
        return courseService.getAttendance(id, user);
    }

    @PutMapping("/{id}/attendance/{studentId}/{sessionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void recordAttendance(@PathVariable Long id,
                                  @PathVariable Long studentId,
                                  @PathVariable Long sessionId,
                                  @RequestBody AttendanceDto.RecordRequest req,
                                  @AuthenticationPrincipal User user) {
        courseService.recordAttendance(id, studentId, sessionId, req, user);
    }

    @PutMapping("/{id}/sessions/{sessionId}/attendance")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void recordBatchAttendance(@PathVariable Long id,
                                       @PathVariable Long sessionId,
                                       @RequestBody AttendanceDto.BatchRequest req,
                                       @AuthenticationPrincipal User user) {
        courseService.recordBatchAttendance(id, sessionId, req, user);
    }

    // ─── JUSTIFICACIONES ───────────────────────────────────

    @GetMapping("/{id}/justifications")
    public Map<String, JustificationDto.JustificationResponse> getJustifications(
            @PathVariable Long id, @AuthenticationPrincipal User user) {
        return courseService.getJustifications(id, user);
    }

    @PostMapping("/{id}/justifications")
    @ResponseStatus(HttpStatus.CREATED)
    public void addJustification(@PathVariable Long id,
                                  @Valid @RequestBody JustificationDto.CreateRequest req,
                                  @AuthenticationPrincipal User user) {
        courseService.addJustification(id, req, user);
    }

    @PutMapping("/{id}/justifications/{studentId}/{sessionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateJustification(@PathVariable Long id,
                                     @PathVariable Long studentId,
                                     @PathVariable Long sessionId,
                                     @RequestBody JustificationDto.UpdateRequest req,
                                     @AuthenticationPrincipal User user) {
        courseService.updateJustification(id, studentId, sessionId, req, user);
    }

    @DeleteMapping("/{id}/justifications/{studentId}/{sessionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeJustification(@PathVariable Long id,
                                     @PathVariable Long studentId,
                                     @PathVariable Long sessionId,
                                     @AuthenticationPrincipal User user) {
        courseService.removeJustification(id, studentId, sessionId, user);
    }
}
