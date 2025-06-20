package com.example.OrderPaymentSystem.service;

import com.example.OrderPaymentSystem.dto.OrderItemRequest;
import com.example.OrderPaymentSystem.dto.OrderRequest;
import com.example.OrderPaymentSystem.entity.*;
import com.example.OrderPaymentSystem.repository.OrderRepository;
import com.example.OrderPaymentSystem.repository.ProductRepository;
import com.example.OrderPaymentSystem.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public void createOrder(String email, OrderRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Товар не найден: id = " + itemRequest.getProductId()));

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            total = total.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .price(product.getPrice())
                    .build();

            orderItems.add(orderItem);
        }

        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .status(Status.NEW)
                .totalAmount(total)
                .items(orderItems)
                .build();

        // Устанавливаем ссылку на заказ для каждого OrderItem
        order.getItems().forEach(item -> item.setOrder(order));

        orderRepository.save(order);
    }

    public List<Order> getUserOrders(String username) {
        return orderRepository.findByUserUsername(username);
    }
}
