package com.lekhsewa.backend.services;


import com.lekhsewa.backend.model.CanvasImage;
import com.lekhsewa.backend.repository.CanvasImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CanvasImageService {
    private final CanvasImageRepository canvasImageRepository;
    private final WebClient djangoClient;

    public String saveImageWaitAndReturnResponse (MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            return "Image is empty";
        }

        byte[] bytes = file.getBytes();
        if (!"image/png".equalsIgnoreCase(file.getContentType()))
            throw new IllegalArgumentException("Only PNG allowed");

        String uniqueFileName = uniqueName();

        CanvasImage canvasImage = new CanvasImage();
        canvasImage.setFileName(uniqueFileName);
        canvasImage.setImageData(bytes);
        canvasImage.setContentType(file.getContentType());

        canvasImageRepository.saveAndFlush(canvasImage);

        return uniqueFileName;
    }

    public boolean getImageByte (Long id)  throws Exception {
        CanvasImage canvasImage = canvasImageRepository.findById(id).orElseThrow(() -> new Exception("Image not found"));

        Path path = Paths.get("output/" + canvasImage.getFileName() + ".png");
        Files.createDirectories(path.getParent());
        Files.write(path, canvasImage.getImageData());

        return true;
    }

    public Map<String, String> sendFileNameForTranscribe(String fileName) throws Exception{
        if (fileName == null || fileName.isEmpty()) {
            throw new IllegalArgumentException("File name is empty");
        }

        Map<String, String> payload = Map.of("name", fileName);
        return djangoClient.post()
                .uri("/api/sendimagetotranscribe")
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON)
                .bodyValue(payload)
                .retrieve()
                .onStatus(s -> s.is4xxClientError() || s.is5xxServerError(), resp ->
                        resp.bodyToMono(String.class).defaultIfEmpty("Upstream error")
                                .map(msg -> new RuntimeException("Django " + resp.statusCode().value() + ": " + msg))
                )
                .bodyToMono(new ParameterizedTypeReference<Map<String, String>>() {})
                .block(Duration.ofSeconds(30));
    }

//    private static String sha256Hex(String text) {
//        try {
//            var md = MessageDigest.getInstance("SHA-256");
//            byte[] dig = md.digest(text.getBytes());
//            StringBuilder sb = new StringBuilder(dig.length * 2);
//            for (byte b : dig) sb.append(String.format("%02x", b));
//            return sb.toString();
//        } catch (Exception e) {
//            throw new IllegalStateException("Hashing failed", e);
//        }
//    }

    private static String uniqueName() {
        return UUID.randomUUID().toString();
    }

}



