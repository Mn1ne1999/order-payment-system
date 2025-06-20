package com.example.OrderPaymentSystem.dto;

import lombok.Data;

@Data
public class RoleUpdateRequest {
    private String role; // "ADMIN", "CUSTOMER", "SELLER"
}
