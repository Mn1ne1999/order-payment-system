package com.example.OrderPaymentSystem.controller;

import com.example.OrderPaymentSystem.dto.ProductRequest;
import com.example.OrderPaymentSystem.dto.ProductResponse;
import com.example.OrderPaymentSystem.service.ProductService;
import com.example.OrderPaymentSystem.service.StorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;


import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final StorageService storageService;

    /* ---------- CREATE ---------- */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ProductResponse createProduct(
            @RequestPart("data") ProductRequest req,
            @RequestPart(value="file", required=false) MultipartFile file) throws IOException {

        String img = (file!=null && !file.isEmpty()) ? storageService.store(file) : null;
        return productService.createProduct(req, img);
    }

    /* ---------- READ ONE ---------- */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    /* ---------- READ ALL  (+ фильтр по категории/ids) ---------- */
    @GetMapping
    public List<ProductResponse> getAll(
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) List<Long> ids)        // ② добавили ids
    {
        if (ids != null && !ids.isEmpty())             // ← приоритет «ids»
            return productService.getByIds(ids);

        if (category != null)
            return productService.getByCategory(category);

        return productService.getAllProducts();
    }


    /* ---------- UPDATE ---------- */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ProductResponse updateProduct(
            @PathVariable Long id,
            @RequestPart("data") ProductRequest request,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        String imageName = (file != null && !file.isEmpty())
                ? storageService.store(file)
                : null;

        return productService.updateProduct(id, request, imageName);
    }

    /* ---------- DELETE ---------- */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER')")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("Товар успешно удалён");
    }

    @GetMapping(params = "ids")
    public List<ProductResponse> productsByIds(@RequestParam List<Long> ids){
        return productService.getByIds(ids);
    }

}
