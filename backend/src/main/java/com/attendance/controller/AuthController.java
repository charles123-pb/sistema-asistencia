package com.attendance.controller;

import com.attendance.dto.AuthDto;
import com.attendance.dto.UserDto;
import com.attendance.entity.User;
import com.attendance.repository.UserRepository;
import com.attendance.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    /**
     * POST /api/auth/login
     * Body: { userId: number, pin: string }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDto.LoginRequest req) {
        User user = userRepository.findById(req.getUserId())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(req.getPin(), user.getPin())) {
            return ResponseEntity.status(401).body(Map.of("error", "Credenciales incorrectas"));
        }

        if (user.getStatus() == User.UserStatus.inactive) {
            return ResponseEntity.status(403).body(Map.of("error", "Usuario inactivo"));
        }

        String token = jwtUtil.generateToken(user.getId(), user.getRole().name());
        UserDto.UserResponse userResponse = UserDto.UserResponse.from(user);

        return ResponseEntity.ok(new AuthDto.LoginResponse(token, userResponse));
    }

    /**
     * GET /api/auth/me
     * Requiere Authorization: Bearer <token>
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto.UserResponse> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserDto.UserResponse.from(user));
    }
}
