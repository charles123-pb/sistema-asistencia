package com.attendance.controller;

import com.attendance.dto.UserDto;
import com.attendance.entity.User;
import com.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    /**
     * GET /api/users
     * Listar todos los usuarios (público - para login)
     */
    @GetMapping
    public ResponseEntity<List<UserDto.UserResponse>> getAllUsers() {
        List<UserDto.UserResponse> users = userRepository.findAll()
                .stream()
                .filter(u -> u.getStatus() == User.UserStatus.active)
                .map(UserDto.UserResponse::from)
                .toList();
        return ResponseEntity.ok(users);
    }

    /**
     * GET /api/users/{id}
     * Obtener usuario por ID (público)
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserDto.UserResponse> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(UserDto.UserResponse.from(user));
    }
}
