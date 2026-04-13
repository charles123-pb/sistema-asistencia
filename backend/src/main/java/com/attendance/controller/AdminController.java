package com.attendance.controller;

import com.attendance.dto.CourseDto;
import com.attendance.dto.UserDto;
import com.attendance.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        return adminService.getStats();
    }

    @GetMapping("/users")
    public List<UserDto.UserResponse> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/courses")
    public List<CourseDto.CourseResponse> getAllCourses() {
        return adminService.getAllCourses();
    }

    @GetMapping("/teachers")
    public List<UserDto.UserResponse> getTeachers() {
        return adminService.getTeachers();
    }

    @PostMapping("/teachers")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto.UserResponse createTeacher(@Valid @RequestBody UserDto.CreateTeacherRequest req) {
        return adminService.createTeacher(req);
    }

    @PutMapping("/teachers/{id}")
    public UserDto.UserResponse updateTeacher(@PathVariable Long id,
                                               @RequestBody UserDto.UpdateTeacherRequest req) {
        return adminService.updateTeacher(id, req);
    }

    @DeleteMapping("/teachers/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTeacher(@PathVariable Long id) {
        adminService.deleteTeacher(id);
    }
}
