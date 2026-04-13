package com.attendance.config;

import com.attendance.entity.Attendance;
import com.attendance.entity.Course;
import com.attendance.entity.Session;
import com.attendance.entity.Student;
import com.attendance.entity.User;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.CourseRepository;
import com.attendance.repository.SessionRepository;
import com.attendance.repository.StudentRepository;
import com.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final SessionRepository sessionRepository;
    private final AttendanceRepository attendanceRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_EMAIL:admin@universidad.edu}")
    private String adminEmail;

    @Value("${ADMIN_PIN:0000}")
    private String adminPin;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Admin por defecto (valores desde variables de entorno)
            User admin = User.builder()
                .name("Administrador")
                .email(adminEmail)
                .pin(passwordEncoder.encode(adminPin))
                .status(User.UserStatus.active)
                .role(User.UserRole.admin)
                .build();
            userRepository.save(admin);

            // Docente de prueba (cursos y alumnos de ejemplo asociados a este usuario)
            User teacher = User.builder()
                    .name("Juan Pérez")
                    .email("jperez@universidad.edu")
                    .dept("Ingeniería de Sistemas")
                    .pin(passwordEncoder.encode("5678"))
                    .status(User.UserStatus.active)
                    .role(User.UserRole.teacher)
                    .build();
            userRepository.save(teacher);

            // Cursos de prueba
            Course c1 = courseRepository.save(Course.builder()
                    .name("Programación I")
                    .code("CS-101")
                    .sec("A")
                    .sem("2026-I")
                    .credits(4)
                    .minatt(70)
                    .color(2)
                    .icon(1)
                    .desc("Fundamentos de programación")
                    .teacher(teacher)
                    .build());

            Course c2 = courseRepository.save(Course.builder()
                    .name("Base de Datos")
                    .code("CS-205")
                    .sec("B")
                    .sem("2026-II")
                    .credits(3)
                    .minatt(75)
                    .color(4)
                    .icon(3)
                    .desc("Modelado y SQL")
                    .teacher(teacher)
                    .build());

            // Alumnos de prueba
            Student sAna = studentRepository.save(Student.builder()
                    .name("Ana Torres")
                    .code("2026-001")
                    .sem("2026-I")
                    .email("ana.torres@uni.edu")
                    .course(c1)
                    .build());

            Student sLuis = studentRepository.save(Student.builder()
                    .name("Luis Quispe")
                    .code("2026-002")
                    .sem("2026-I")
                    .email("luis.quispe@uni.edu")
                    .course(c1)
                    .build());

            Student sMari = studentRepository.save(Student.builder()
                    .name("Mariana Rojas")
                    .code("2026-101")
                    .sem("2026-II")
                    .email("mariana.rojas@uni.edu")
                    .course(c2)
                    .build());

            // Sesiones de prueba (teoría + práctica en Programación I; teoría en Base de datos)
            Session c1Teoria = sessionRepository.save(Session.builder()
                    .name("Semana 1 - Introducción")
                    .date("2026-04-07")
                    .time("08:00")
                    .type("Clase teórica")
                    .comp("t")
                    .course(c1)
                    .build());

            Session c1Lab = sessionRepository.save(Session.builder()
                    .name("Laboratorio 1 - Entorno")
                    .date("2026-04-09")
                    .time("10:00")
                    .type("Práctica de laboratorio")
                    .comp("p")
                    .course(c1)
                    .build());

            Session c2Teoria = sessionRepository.save(Session.builder()
                    .name("Modelo relacional")
                    .date("2026-04-08")
                    .time("14:00")
                    .type("Clase teórica")
                    .comp("t")
                    .course(c2)
                    .build());

            // Asistencia de ejemplo (clave API: studentId_sessionId)
            attendanceRepository.save(Attendance.builder().course(c1).student(sAna).session(c1Teoria).value("p").build());
            attendanceRepository.save(Attendance.builder().course(c1).student(sAna).session(c1Lab).value("t").build());
            attendanceRepository.save(Attendance.builder().course(c1).student(sLuis).session(c1Teoria).value("p").build());
            attendanceRepository.save(Attendance.builder().course(c1).student(sLuis).session(c1Lab).value("a").build());
            attendanceRepository.save(Attendance.builder().course(c2).student(sMari).session(c2Teoria).value("p").build());

            log.info("=== Datos iniciales creados ===");
            log.info("Admin  → ID: {}, email: {}", admin.getId(), admin.getEmail());
            log.info("Docente → ID: {}, email: {}", teacher.getId(), teacher.getEmail());
            log.info("Cursos de prueba: {}, {}", c1.getName(), c2.getName());
        }
    }
}
