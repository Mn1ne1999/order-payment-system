package com.example.OrderPaymentSystem.repository;

import com.example.OrderPaymentSystem.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserUsername(String username);
}
