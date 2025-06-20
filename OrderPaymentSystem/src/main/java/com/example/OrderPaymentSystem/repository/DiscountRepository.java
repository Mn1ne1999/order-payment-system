package com.example.OrderPaymentSystem.repository;

import com.example.OrderPaymentSystem.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountRepository extends JpaRepository<Discount, Long> {
}
