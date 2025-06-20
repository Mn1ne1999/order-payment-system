    package com.example.OrderPaymentSystem.service;

    import com.example.OrderPaymentSystem.dto.ProductRequest;
    import com.example.OrderPaymentSystem.dto.ProductResponse;
    import com.example.OrderPaymentSystem.entity.Category;
    import com.example.OrderPaymentSystem.entity.Product;
    import com.example.OrderPaymentSystem.repository.CategoryRepository;
    import com.example.OrderPaymentSystem.repository.ProductRepository;
    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Service;

    import java.util.List;
    import java.util.stream.Collectors;

    @Service
    @RequiredArgsConstructor
    public class ProductService {

        private final ProductRepository productRepository;
        private final CategoryRepository categoryRepository;

        public ProductResponse createProduct(ProductRequest request, String img) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Категория не найдена"));

            Product product = Product.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .price(request.getPrice())
                    .stock(request.getStock())
                    .imagePath(img)
                    .available(request.getAvailable() != null ? request.getAvailable() : true)
                    .category(category)
                    .build();

            Product saved = productRepository.save(product);

            return mapToResponse(saved);
        }

        public List<ProductResponse> getAllProducts() {
            return productRepository.findAll()
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }

        public List<ProductResponse> getByCategory(Long categoryId) {
            return productRepository.findByCategoryId(categoryId)   // метод из репозитория
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }



        private ProductResponse mapToResponse(Product product) {
            return ProductResponse.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .description(product.getDescription())
                    .price(product.getPrice())
                    .stock(product.getStock())
                    .imagePath(product.getImagePath())
                    .categoryName(product.getCategory().getName())
                    .build();
        }

        public ProductResponse updateProduct(Long id, ProductRequest req, String img){

            Product p = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Товар не найден"));
            Category cat = categoryRepository.findById(req.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Категория не найдена"));

            p.setName(req.getName());
            p.setDescription(req.getDescription());
            p.setPrice(req.getPrice());
            p.setStock(req.getStock());
            p.setAvailable(req.getAvailable());
            p.setCategory(cat);

            if (img != null)                // картинку меняем, только если файл прислали
                p.setImagePath(img);

            return mapToResponse(productRepository.save(p));
        }

        public void deleteProduct(Long id) {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Товар не найден"));
            productRepository.delete(product);
        }

        public ProductResponse getById(Long id) {
            Product product = productRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Товар не найден"));

            return ProductResponse.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .description(product.getDescription())
                    .price(product.getPrice())
                    .stock(product.getStock())
                    .available(product.isAvailable())
                    .imagePath(product.getImagePath())
                    .category(product.getCategory())
                    .seller(product.getSeller())
                    .build();
        }


        public List<ProductResponse> getByIds(List<Long> ids){
            return productRepository.findAllById(ids)
                    .stream().map(this::mapToResponse).toList();
        }


    }
