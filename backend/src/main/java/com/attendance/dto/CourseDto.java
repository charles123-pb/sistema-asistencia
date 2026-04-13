package com.attendance.dto;

import com.attendance.entity.Course;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;

public class CourseDto {

    @Data
    public static class CourseResponse {
        private Long id;
        private String name;
        private String code;
        private String sec;
        private String sem;
        private Integer credits;
        private Integer minatt;
        private Integer color;
        private Integer icon;
        private String desc;
        private List<StudentDto.StudentResponse> students;
        private List<SessionDto.SessionResponse> sessions;
        private Map<String, String> att;
        private Map<String, JustificationDto.JustificationResponse> justifications;

        public static CourseResponse from(Course c) {
            CourseResponse r = new CourseResponse();
            r.id = c.getId();
            r.name = c.getName();
            r.code = c.getCode();
            r.sec = c.getSec();
            r.sem = c.getSem();
            r.credits = c.getCredits();
            r.minatt = c.getMinatt();
            r.color = c.getColor();
            r.icon = c.getIcon();
            r.desc = c.getDesc();
            r.students = List.of();
            r.sessions = List.of();
            r.att = Map.of();
            r.justifications = Map.of();
            return r;
        }
    }

    @Data
    public static class CreateCourseRequest {
        @NotBlank
        private String name;
        @NotBlank
        private String code;
        private String sec;
        private String sem;
        private Integer credits;
        private Integer minatt = 70;
        private Integer color = 0;
        private Integer icon = 0;
        private String desc;
    }

    @Data
    public static class UpdateCourseRequest {
        private String name;
        private String code;
        private String sec;
        private String sem;
        private Integer credits;
        private Integer minatt;
        private Integer color;
        private Integer icon;
        private String desc;
    }
}
