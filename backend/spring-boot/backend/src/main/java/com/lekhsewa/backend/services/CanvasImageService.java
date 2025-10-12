package com.lekhsewa.backend.services;


import com.lekhsewa.backend.model.CanvasImage;
import com.lekhsewa.backend.repository.CanvasImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;

@Service
@RequiredArgsConstructor
public class CanvasImageService {
    private final CanvasImageRepository canvasImageRepository;

    public String saveImageAndReturnHash (MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            return "Image is empty";
        }

        byte[] bytes = file.getBytes();
        if (!"image/png".equalsIgnoreCase(file.getContentType()))
            throw new IllegalArgumentException("Only PNG allowed");

        String fileName = file.getOriginalFilename() == null ? "unknown.png" : file.getOriginalFilename();
        String hashFileName = sha256Hex(fileName);

        CanvasImage canvasImage = new CanvasImage();
        canvasImage.setFileName(hashFileName);
        canvasImage.setImageData(bytes);
        canvasImage.setContentType(file.getContentType());

        canvasImageRepository.save(canvasImage);

        return hashFileName;
    }


    private static String sha256Hex(String text) {
        try {
            var md = MessageDigest.getInstance("SHA-256");
            byte[] dig = md.digest(text.getBytes());
            StringBuilder sb = new StringBuilder(dig.length * 2);
            for (byte b : dig) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("Hashing failed", e);
        }
    }
}


