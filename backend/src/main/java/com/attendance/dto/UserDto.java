package com.attendance.dto;

import com.attendance.entity.User;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class UserDto {

    @Data
    public static class UserResponse {
        private Long id;
        private String name;
        private String email;
        private String dept;
        private String pin;
        private String pinDisplay;
        private String status;
        private String role;
        private List<CourseDto.CourseResponse> courses;

        public static UserResponse from(User u) {
            UserResponse r = new UserResponse();
            r.id = u.getId();
            r.name = u.getName();
            r.email = u.getEmail();
            r.dept = u.getDept();
            r.pin = u.getPin();
            r.pinDisplay = u.getPinDisplay();
            r.status = u.getStatus().name();
            r.role = u.getRole().name();
            r.courses = List.of(); // se llena en el servicio si hace falta
            return r;
        }
    }

    @Data
    public static class CreateTeacherRequest {
        @NotBlank
        private String name;
        private String email;
        private String dept;
        @NotBlank
        private String pin;
        private String status = "active";
    }

    @Data
    public static class UpdateTeacherRequest {
        private String name;
        private String email;
        private String dept;
        private String pin;
        private String status;
    }
}
