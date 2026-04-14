package com.attendance.service;

import com.attendance.dto.CourseDto;
import com.attendance.dto.UserDto;
import com.attendance.entity.User;
import com.attendance.repository.CourseRepository;
import com.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepo;
    private final CourseRepository courseRepo;
    private final PasswordEncoder passwordEncoder;

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTeachers", userRepo.findAll().stream()
                .filter(u -> u.getRole() == User.UserRole.teacher).count());
        stats.put("totalCourses", courseRepo.count());
        stats.put("totalUsers", userRepo.count());
        stats.put("activeTeachers", userRepo.findAll().stream()
                .filter(u -> u.getRole() == User.UserRole.teacher
                          && u.getStatus() == User.UserStatus.active).count());
        return stats;
    }

    public List<UserDto.UserResponse> getAllUsers() {
        return userRepo.findAll().stream()
                .map(UserDto.UserResponse::from)
                .collect(Collectors.toList());
    }

    public List<CourseDto.CourseResponse> getAllCourses() {
        return courseRepo.findAll().stream()
                .map(CourseDto.CourseResponse::from)
                .collect(Collectors.toList());
    }

    public List<UserDto.UserResponse> getTeachers() {
        return userRepo.findAll().stream()
                .filter(u -> u.getRole() == User.UserRole.teacher)
                .map(UserDto.UserResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto.UserResponse createTeacher(UserDto.CreateTeacherRequest req) {
        User teacher = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .dept(req.getDept())
                .pin(passwordEncoder.encode(req.getPin()))
                .pinDisplay(req.getPin())
                .status(User.UserStatus.valueOf(req.getStatus() != null ? req.getStatus() : "active"))
                .role(User.UserRole.teacher)
                .build();
        return UserDto.UserResponse.from(userRepo.save(teacher));
    }

    @Transactional
    public UserDto.UserResponse updateTeacher(Long teacherId, UserDto.UpdateTeacherRequest req) {
        User teacher = userRepo.findById(teacherId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Docente no encontrado"));
        if (req.getName() != null) teacher.setName(req.getName());
        if (req.getEmail() != null) teacher.setEmail(req.getEmail());
        if (req.getDept() != null) teacher.setDept(req.getDept());
        if (req.getPin() != null) {
            teacher.setPin(passwordEncoder.encode(req.getPin()));
            teacher.setPinDisplay(req.getPin());
        }
        if (req.getStatus() != null) teacher.setStatus(User.UserStatus.valueOf(req.getStatus()));
        return UserDto.UserResponse.from(userRepo.save(teacher));
    }

    @Transactional
    public void deleteTeacher(Long teacherId) {
        User teacher = userRepo.findById(teacherId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Docente no encontrado"));
        if (teacher.getRole() == User.UserRole.admin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No se puede eliminar un admin");
        }
        userRepo.delete(teacher);
    }
}
