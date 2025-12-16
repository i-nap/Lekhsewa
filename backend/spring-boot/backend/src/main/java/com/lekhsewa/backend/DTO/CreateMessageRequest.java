package com.lekhsewa.backend.DTO;

public class CreateMessageRequest {
    private String fullName;
    private String email;
    private String message;

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getMessage() {
        return message;
    }
}
