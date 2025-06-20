package com.example.OrderPaymentSystem.service;

import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class StorageService {

    private final Path root = Paths.get("uploads");

    public StorageService() throws IOException {
        Files.createDirectories(root);
    }

    /** сохраняет файл и возвращает, например, "iphone13.png" */
    public String store(MultipartFile f) throws IOException {
        String ext = StringUtils.getFilenameExtension(f.getOriginalFilename());
        String name = UUID.randomUUID() + "." + ext;
        Files.copy(f.getInputStream(), root.resolve(name), StandardCopyOption.REPLACE_EXISTING);
        return name;
    }
}
