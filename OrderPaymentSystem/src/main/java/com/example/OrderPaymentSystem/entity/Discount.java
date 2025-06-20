package com.example.OrderPaymentSystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "discounts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal percentage;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @OneToOne
    @JoinColumn(name = "product_id", unique = true)
    private Product product;
}
