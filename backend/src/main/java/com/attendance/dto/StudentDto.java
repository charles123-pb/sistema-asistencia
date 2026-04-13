package com.attendance.dto;

import com.attendance.entity.Student;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class StudentDto {

    @Data
    public static class StudentResponse {
        private Long id;
        private String name;
        private String code;
        private String sem;
        private String email;

        public static StudentResponse from(Student s) {
            StudentResponse r = new StudentResponse();
            r.id = s.getId();
            r.name = s.getName();
            r.code = s.getCode();
            r.sem = s.getSem();
            r.email = s.getEmail();
            return r;
        }
    }

    @Data
    public static class CreateStudentRequest {
        @NotBlank
        private String name;
        @NotBlank
        private String code;
        private String sem;
        private String email;
    }

    @Data
    public static class ImportStudentsRequest {
        private List<CreateStudentRequest> students;
    }

    @Data
    public static class UpdateStudentRequest {
        private String name;
        private String code;
        private String sem;
        private String email;
    }
}
