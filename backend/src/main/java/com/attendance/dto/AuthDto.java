package com.attendance.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// ─── AUTH ───────────────────────────────────────────────
public class AuthDto {

    @Data
    public static class LoginRequest {
        @NotNull
        @JsonAlias({"user_id", "userid"})
        private Long userId;
        @NotBlank
        private String pin;
    }

    @Data
    public static class LoginResponse {
        private String token;
        private UserDto.UserResponse user;

        public LoginResponse(String token, UserDto.UserResponse user) {
            this.token = token;
            this.user = user;
        }
    }
}
