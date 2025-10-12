package com.lekhsewa.backend.controller;

import com.lekhsewa.backend.model.CanvasImage;
import com.lekhsewa.backend.repository.CanvasImageRepository;
import com.lekhsewa.backend.services.CanvasImageService;
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
public class CanvasImageController {

    private final CanvasImageService service;

    public CanvasImageController(CanvasImageService service) {
        this.service = service;
    }

    @PostMapping(path = "/sendcanvasimage")
    public ResponseEntity<?> sendCanvasImage(@RequestParam("file") MultipartFile file) {
        try {
            String uniqueFileName = service.saveImageWaitAndReturnResponse(file);
//            Map<String, String> response = service.sendFileNameForTranscribe(uniqueFileName); //django bhaye si halna lahi
//            return ResponseEntity.status(HttpStatus.CREATED).body(response);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("FileName", uniqueFileName)); //testing lahi matra

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of("error", e.getMessage()));
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
