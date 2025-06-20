package com.example.OrderPaymentSystem.repository;

import com.example.OrderPaymentSystem.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}
