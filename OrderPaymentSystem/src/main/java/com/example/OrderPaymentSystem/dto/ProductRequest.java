package com.example.OrderPaymentSystem.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String imagePath;
    private Long categoryId;
    private Boolean available;
}

