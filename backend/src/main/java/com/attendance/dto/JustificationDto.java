package com.attendance.dto;

import com.attendance.entity.Justification;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

public class JustificationDto {

    @Data
    public static class JustificationResponse {
        private String reason;
        private String obs;

        public static JustificationResponse from(Justification j) {
            JustificationResponse r = new JustificationResponse();
            r.reason = j.getReason();
            r.obs = j.getObs();
            return r;
        }
    }

    @Data
    public static class CreateRequest {
        private Long studentId;
        private Long sessionId;
        @NotBlank
        private String reason;
        private String obs;
    }

    @Data
    public static class UpdateRequest {
        @NotBlank
        private String reason;
        private String obs;
    }
}
