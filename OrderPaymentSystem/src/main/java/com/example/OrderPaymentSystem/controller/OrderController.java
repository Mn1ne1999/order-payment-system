package com.example.OrderPaymentSystem.controller;

import com.example.OrderPaymentSystem.dto.OrderRequest;
import com.example.OrderPaymentSystem.entity.Order;
import com.example.OrderPaymentSystem.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody OrderRequest request, Authentication authentication) {
        orderService.createOrder(authentication.getName(), request);
        return ResponseEntity.ok("Заказ успешно создан");
    }

    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        List<Order> orders = orderService.getUserOrders(authentication.getName());
        return ResponseEntity.ok(orders);
    }
}
