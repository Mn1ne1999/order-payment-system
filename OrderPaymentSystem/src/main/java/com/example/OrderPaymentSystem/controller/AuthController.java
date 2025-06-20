package com.example.OrderPaymentSystem.controller;

import com.example.OrderPaymentSystem.dto.AuthResponse;
import com.example.OrderPaymentSystem.dto.LoginRequest;
import com.example.OrderPaymentSystem.dto.RegisterRequest;
import com.example.OrderPaymentSystem.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> register(@RequestBody RegisterRequest request) {
        authService.register(request);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Пользователь успешно зарегистрирован");

        return ResponseEntity.ok(response);
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        AuthResponse token = authService.login(request);
        return ResponseEntity.ok(token);
    }
}
