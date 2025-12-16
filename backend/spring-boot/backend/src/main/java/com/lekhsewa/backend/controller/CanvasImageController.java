package com.lekhsewa.backend.controller;

import com.lekhsewa.backend.model.CanvasImage;
import com.lekhsewa.backend.repository.CanvasImageRepository;
import com.lekhsewa.backend.services.CanvasImageService;
import com.lekhsewa.backend.services.UserServices;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CanvasImageController {

    private final CanvasImageService service;
    private final UserServices userServices;
    @PostMapping(path = "/sendcanvasimage")
    public ResponseEntity<?> sendCanvasImage(@RequestParam("file") MultipartFile file, @RequestParam ("sub") String sub) {
        try {

            boolean canProcess = userServices.isUserAbleToProcessMoreImage(sub);
            System.out.println(canProcess);
            if (!canProcess) {
                return ResponseEntity
                        .status(HttpStatus.TOO_MANY_REQUESTS)
                        .body(Map.of(
                                "error", "QUOTA_EXCEEDED",
                                "message", "You have exceeded your daily image processing quota"
                        ));
            }


            String uniqueFileName = service.saveImageWaitAndReturnResponse(file);
            Map<String, String> response = service.sendFileForTranscribe(uniqueFileName); //django bhaye si halna lahi
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

//            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("FileName", uniqueFileName)); //testing lahi matra

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            String msg = e.getMessage() == null ? "" : e.getMessage().toLowerCase();
            if (msg.contains("429") || msg.contains("too many request")) {
                return ResponseEntity
                        .status(HttpStatus.SERVICE_UNAVAILABLE)
                        .body(Map.of(
                                "error", "SERVER_ISSUE",
                                "message", "Server issue, try again"
                        ));
            }
            return ResponseEntity
                    .status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Processing failed", "detail", e.getMessage()));
        }
    }


    @GetMapping(path = "/test/{id}")
    public ResponseEntity<String> getByteOfImage(@PathVariable long id) throws Exception {
        boolean check = service.getImageByte(id);
        return check ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }
}
