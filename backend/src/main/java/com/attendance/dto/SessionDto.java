package com.attendance.dto;

import com.attendance.entity.Session;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

public class SessionDto {

    @Data
    public static class SessionResponse {
        private Long id;
        private String name;
        private String date;
        private String time;
        private String type;
        private String comp;

        public static SessionResponse from(Session s) {
            SessionResponse r = new SessionResponse();
            r.id = s.getId();
            r.name = s.getName();
            r.date = s.getDate();
            r.time = s.getTime();
            r.type = s.getType();
            r.comp = s.getComp();
            return r;
        }
    }

    @Data
    public static class CreateSessionRequest {
        @NotBlank
        private String name;
        @NotBlank
        private String date;
        private String time;
        private String type;
        private String comp; // 't' o 'p'
    }

    @Data
    public static class UpdateSessionRequest {
        private String name;
        private String date;
        private String time;
        private String type;
        private String comp;
    }
}
