package com.lekhsewa.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class DjangoConfig {

    @Bean
    public WebClient djangoClient() {
        return WebClient.builder()
                .baseUrl("http://127.0.0.1:8000")
                .build();
    }
}
