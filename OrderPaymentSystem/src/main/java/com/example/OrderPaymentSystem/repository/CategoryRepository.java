package com.example.OrderPaymentSystem.repository;

import com.example.OrderPaymentSystem.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
