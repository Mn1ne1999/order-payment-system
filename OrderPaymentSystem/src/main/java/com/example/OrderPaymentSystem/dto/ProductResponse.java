package com.example.OrderPaymentSystem.dto;

import com.example.OrderPaymentSystem.entity.Category;
import com.example.OrderPaymentSystem.entity.User;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String categoryName;
    private Boolean available;
    private User seller;
    private Category category;
    private String imagePath;
}

