package com.lekhsewa.backend.repository;

import com.lekhsewa.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
