package com.example.OrderPaymentSystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// UserResponse.java
@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String role;
}
