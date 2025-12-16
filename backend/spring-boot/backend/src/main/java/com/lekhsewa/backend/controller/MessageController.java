package com.lekhsewa.backend.controller;


import com.lekhsewa.backend.DTO.CreateMessageRequest;
import com.lekhsewa.backend.model.Message;
import com.lekhsewa.backend.repository.MessageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/message")
public class MessageController {

    private final MessageRepository messageRepository;

    public MessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @PostMapping
    public ResponseEntity<?> createMessage(@RequestBody CreateMessageRequest request) {

        if (
            request.getFullName() == null || request.getFullName().isBlank() ||
            request.getEmail() == null || request.getEmail().isBlank() ||
            request.getMessage() == null || request.getMessage().isBlank()
        ) {
            return ResponseEntity
                    .badRequest()
                    .body("All fields are required");
        }

        Message message = new Message();
        message.setFullName(request.getFullName());
        message.setEmail(request.getEmail());
        message.setMessage(request.getMessage());

        messageRepository.save(message);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Message received");
    }
}
