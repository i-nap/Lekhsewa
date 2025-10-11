package com.lekhsewa.backend.controller;

import com.lekhsewa.backend.services.CanvasImageService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CanvasImageController {

    private final CanvasImageService service;

    public CanvasImageController(CanvasImageService service) {
        this.service = service;
    }

    @PostMapping(path = "/sendcanvasimage")
    public ResponseEntity<Map<String, String>> sendCanvasImage(@RequestParam("file") MultipartFile file) throws Exception {
        String canvasId = service.saveImageAndReturnHash(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("canvas_id", canvasId));
    }

}
