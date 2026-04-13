package com.attendance.service;

import com.attendance.dto.*;
import com.attendance.entity.*;
import com.attendance.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepo;
    private final StudentRepository studentRepo;
    private final SessionRepository sessionRepo;
    private final AttendanceRepository attendanceRepo;
    private final JustificationRepository justificationRepo;

    // ─── CURSOS ───────────────────────────────────────────

    public List<CourseDto.CourseResponse> getCourses(User teacher) {
        return courseRepo.findByTeacherId(teacher.getId()).stream()
                .map(this::buildCourseResponse)
                .collect(Collectors.toList());
    }

    public CourseDto.CourseResponse getCourse(Long courseId, User teacher) {
        Course course = findCourseOwned(courseId, teacher);
        return buildCourseResponse(course);
    }

    @Transactional
    public CourseDto.CourseResponse createCourse(CourseDto.CreateCourseRequest req, User teacher) {
        Course course = Course.builder()
                .name(req.getName())
                .code(req.getCode())
                .sec(req.getSec())
                .sem(req.getSem())
                .credits(req.getCredits())
                .minatt(req.getMinatt())
                .color(req.getColor())
                .icon(req.getIcon())
                .desc(req.getDesc())
                .teacher(teacher)
                .build();
        return buildCourseResponse(courseRepo.save(course));
    }

    @Transactional
    public CourseDto.CourseResponse updateCourse(Long courseId, CourseDto.UpdateCourseRequest req, User teacher) {
        Course course = findCourseOwned(courseId, teacher);
        if (req.getName() != null) course.setName(req.getName());
        if (req.getCode() != null) course.setCode(req.getCode());
        if (req.getSec() != null) course.setSec(req.getSec());
        if (req.getSem() != null) course.setSem(req.getSem());
        if (req.getCredits() != null) course.setCredits(req.getCredits());
        if (req.getMinatt() != null) course.setMinatt(req.getMinatt());
        if (req.getColor() != null) course.setColor(req.getColor());
        if (req.getIcon() != null) course.setIcon(req.getIcon());
        if (req.getDesc() != null) course.setDesc(req.getDesc());
        return buildCourseResponse(courseRepo.save(course));
    }

    @Transactional
    public void deleteCourse(Long courseId, User teacher) {
        Course course = findCourseOwned(courseId, teacher);
        courseRepo.delete(course);
    }

    // ─── ESTUDIANTES ───────────────────────────────────────

    public List<StudentDto.StudentResponse> getStudents(Long courseId, User teacher) {
        findCourseOwned(courseId, teacher);
        return studentRepo.findByCourseId(courseId).stream()
                .map(StudentDto.StudentResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public StudentDto.StudentResponse addStudent(Long courseId, StudentDto.CreateStudentRequest req, User teacher) {
        Course course = findCourseOwned(courseId, teacher);
        Student student = Student.builder()
                .name(req.getName())
                .code(req.getCode())
                .sem(req.getSem())
                .email(req.getEmail())
                .course(course)
                .build();
        return StudentDto.StudentResponse.from(studentRepo.save(student));
    }

    @Transactional
    public List<StudentDto.StudentResponse> importStudents(Long courseId,
                                                            StudentDto.ImportStudentsRequest req,
                                                            User teacher) {
        Course course = findCourseOwned(courseId, teacher);
        List<Student> students = req.getStudents().stream()
                .map(s -> Student.builder()
                        .name(s.getName())
                        .code(s.getCode())
                        .sem(s.getSem())
                        .email(s.getEmail())
                        .course(course)
                        .build())
                .collect(Collectors.toList());
        return studentRepo.saveAll(students).stream()
                .map(StudentDto.StudentResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeStudent(Long courseId, Long studentId, User teacher) {
        findCourseOwned(courseId, teacher);
        studentRepo.deleteByIdAndCourseId(studentId, courseId);
    }

    @Transactional
    public StudentDto.StudentResponse updateStudent(Long courseId, Long studentId,
                                                     StudentDto.UpdateStudentRequest req, User teacher) {
        findCourseOwned(courseId, teacher);
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Estudiante no encontrado"));
        if (!student.getCourse().getId().equals(courseId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Estudiante no pertenece a este curso");
        }
        if (req.getName() != null) student.setName(req.getName());
        if (req.getCode() != null) student.setCode(req.getCode());
        if (req.getSem() != null) student.setSem(req.getSem());
        if (req.getEmail() != null) student.setEmail(req.getEmail());
        return StudentDto.StudentResponse.from(studentRepo.save(student));
    }

    // ─── SESIONES ──────────────────────────────────────────

    public List<SessionDto.SessionResponse> getSessions(Long courseId, User teacher) {
        findCourseOwned(courseId, teacher);
        return sessionRepo.findByCourseId(courseId).stream()
                .map(SessionDto.SessionResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public SessionDto.SessionResponse createSession(Long courseId, SessionDto.CreateSessionRequest req, User teacher) {
        Course course = findCourseOwned(courseId, teacher);
        Session session = Session.builder()
                .name(req.getName())
                .date(req.getDate())
                .time(req.getTime())
                .type(req.getType())
                .comp(req.getComp())
                .course(course)
                .build();
        return SessionDto.SessionResponse.from(sessionRepo.save(session));
    }

    @Transactional
    public SessionDto.SessionResponse updateSession(Long courseId, Long sessionId,
                                                    SessionDto.UpdateSessionRequest req, User teacher) {
        findCourseOwned(courseId, teacher);
        Session session = sessionRepo.findByIdAndCourseId(sessionId, courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sesión no encontrada"));
        if (req.getName() != null) session.setName(req.getName());
        if (req.getDate() != null) session.setDate(req.getDate());
        if (req.getTime() != null) session.setTime(req.getTime());
        if (req.getType() != null) session.setType(req.getType());
        if (req.getComp() != null) session.setComp(req.getComp());
        return SessionDto.SessionResponse.from(sessionRepo.save(session));
    }

    @Transactional
    public void deleteSession(Long courseId, Long sessionId, User teacher) {
        findCourseOwned(courseId, teacher);
        Session session = sessionRepo.findByIdAndCourseId(sessionId, courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sesión no encontrada"));
        sessionRepo.delete(session);
    }

    // ─── ASISTENCIA ────────────────────────────────────────

    public Map<String, String> getAttendance(Long courseId, User teacher) {
        findCourseOwned(courseId, teacher);
        Map<String, String> result = new HashMap<>();
        attendanceRepo.findByCourseId(courseId).forEach(a ->
                result.put(a.getStudent().getId() + "_" + a.getSession().getId(), a.getValue())
        );
        return result;
    }

    @Transactional
    public void recordAttendance(Long courseId, Long studentId, Long sessionId,
                                  AttendanceDto.RecordRequest req, User teacher) {
        findCourseOwned(courseId, teacher);
        Attendance att = attendanceRepo.findByStudentIdAndSessionId(studentId, sessionId)
                .orElse(Attendance.builder()
                        .course(courseRepo.getReferenceById(courseId))
                        .student(studentRepo.getReferenceById(studentId))
                        .session(sessionRepo.getReferenceById(sessionId))
                        .build());
        att.setValue(req.getValue());
        attendanceRepo.save(att);
    }

    @Transactional
    public void recordBatchAttendance(Long courseId, Long sessionId,
                                       AttendanceDto.BatchRequest req, User teacher) {
        findCourseOwned(courseId, teacher);
        req.getAttendance().forEach((studentId, value) -> {
            Attendance att = attendanceRepo.findByStudentIdAndSessionId(studentId, sessionId)
                    .orElse(Attendance.builder()
                            .course(courseRepo.getReferenceById(courseId))
                            .student(studentRepo.getReferenceById(studentId))
                            .session(sessionRepo.getReferenceById(sessionId))
                            .build());
            att.setValue(value);
            attendanceRepo.save(att);
        });
    }

    // ─── JUSTIFICACIONES ───────────────────────────────────

    public Map<String, JustificationDto.JustificationResponse> getJustifications(Long courseId, User teacher) {
        findCourseOwned(courseId, teacher);
        Map<String, JustificationDto.JustificationResponse> result = new HashMap<>();
        justificationRepo.findByCourseId(courseId).forEach(j ->
                result.put(j.getStudent().getId() + "_" + j.getSession().getId(),
                        JustificationDto.JustificationResponse.from(j))
        );
        return result;
    }

    @Transactional
    public void addJustification(Long courseId, JustificationDto.CreateRequest req, User teacher) {
        findCourseOwned(courseId, teacher);
        Justification j = Justification.builder()
                .course(courseRepo.getReferenceById(courseId))
                .student(studentRepo.getReferenceById(req.getStudentId()))
                .session(sessionRepo.getReferenceById(req.getSessionId()))
                .reason(req.getReason())
                .obs(req.getObs())
                .build();
        justificationRepo.save(j);
    }

    @Transactional
    public void updateJustification(Long courseId, Long studentId, Long sessionId,
                                     JustificationDto.UpdateRequest req, User teacher) {
        findCourseOwned(courseId, teacher);
        Justification j = justificationRepo.findByStudentIdAndSessionId(studentId, sessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Justificación no encontrada"));
        j.setReason(req.getReason());
        j.setObs(req.getObs());
        justificationRepo.save(j);
    }

    @Transactional
    public void removeJustification(Long courseId, Long studentId, Long sessionId, User teacher) {
        findCourseOwned(courseId, teacher);
        justificationRepo.deleteByStudentIdAndSessionId(studentId, sessionId);
    }

    // ─── UTILS ─────────────────────────────────────────────

    private Course findCourseOwned(Long courseId, User teacher) {
        Course course = courseRepo.findById(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso no encontrado"));

        // Admin puede ver todo; docente solo sus cursos
        if (teacher.getRole() != User.UserRole.admin &&
            !course.getTeacher().getId().equals(teacher.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Sin acceso a este curso");
        }
        return course;
    }

    private CourseDto.CourseResponse buildCourseResponse(Course course) {
        CourseDto.CourseResponse r = CourseDto.CourseResponse.from(course);

        r.setStudents(studentRepo.findByCourseId(course.getId()).stream()
                .map(StudentDto.StudentResponse::from).collect(Collectors.toList()));

        r.setSessions(sessionRepo.findByCourseId(course.getId()).stream()
                .map(SessionDto.SessionResponse::from).collect(Collectors.toList()));

        Map<String, String> att = new HashMap<>();
        attendanceRepo.findByCourseId(course.getId()).forEach(a ->
                att.put(a.getStudent().getId() + "_" + a.getSession().getId(), a.getValue()));
        r.setAtt(att);

        Map<String, JustificationDto.JustificationResponse> just = new HashMap<>();
        justificationRepo.findByCourseId(course.getId()).forEach(j ->
                just.put(j.getStudent().getId() + "_" + j.getSession().getId(),
                        JustificationDto.JustificationResponse.from(j)));
        r.setJustifications(just);

        return r;
    }
}
