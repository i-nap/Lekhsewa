package com.lekhsewa.backend.services;


import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.types.Part;
import com.lekhsewa.backend.model.CanvasImage;
import com.lekhsewa.backend.repository.CanvasImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.time.Duration;
import java.util.*;

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

    public Map<String, String> sendFileForTranscribe(String filename) throws Exception {

        CanvasImage canvasImage = canvasImageRepository.findByFileName(filename).orElseThrow(() -> new Exception("Image not found"));


        if (canvasImage.getImageData() == null || canvasImage.getImageData().length == 0) {
            throw new IllegalArgumentException("File bytes are empty");
        }

        byte[] imageBytes = canvasImage.getImageData();
        String mimeType = canvasImage.getContentType();

        System.out.println("mimetype: " + mimeType);
        System.out.println("imageBytes: " + Arrays.toString(imageBytes));

//        Path path = Paths.get("debug_canvas.jpeg");
//        Files.write(path, imageBytes);

        Part imagePart = Part.fromBytes(imageBytes, mimeType);
        Part textPart = Part.fromText("Can you read the character in the text it is nepali handwriting. Just give the answer not anything more. If u cannot read it just say Not Recognized.Try Again.");

        Client client = new Client();

        Content multimodalContent = Content.fromParts(textPart, imagePart);
        GenerateContentResponse response = client.models.generateContent(
                "gemini-2.5-flash",
                multimodalContent,
                null
        );

        System.out.println(response.text());
        return Map.of("word", Objects.requireNonNull(response.text()));

        //        Map<String, String> payload = Map.of("image", base64Image);
//
//        return djangoClient.post()
//                .uri("http://127.0.0.1:5000/recognize")
//                .contentType(MediaType.APPLICATION_JSON)
//                .accept(MediaType.APPLICATION_JSON)
//                .bodyValue(payload)
//                .retrieve()
//                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
//                .block(Duration.ofSeconds(30));
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



