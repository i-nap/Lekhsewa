package com.lekhsewa.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;

@Entity
@Table(name = "canvas_image")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CanvasImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "file_name", nullable = false, unique = true)
    private String fileName;

    @Column(name = "content_type", nullable = false)
    private String contentType = "image/png";

    @JdbcTypeCode(SqlTypes.VARBINARY)
    @Column(name = "image_data", nullable = false, columnDefinition = "bytea")
    private byte[] imageData;

    @Column(name = "uploaded_at", nullable = false)
    private OffsetDateTime uploadedAt = OffsetDateTime.now();
}
