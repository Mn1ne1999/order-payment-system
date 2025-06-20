package com.example.OrderPaymentSystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private BigDecimal price;

    private Integer stock;

    @Column(nullable = false)
    private Boolean available;

    @ManyToOne
    private User seller;

    @Column(name = "image_path")
    private String imagePath;


    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    public boolean isAvailable() {
        return available;
    }

}
