package com.lekhsewa.backend.repository;

import com.lekhsewa.backend.model.CanvasImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CanvasImageRepository extends JpaRepository<CanvasImage, Long> {
    Optional<CanvasImage> findByFileName(String fileName);
    Optional<CanvasImage> findById(long id);
}
