package com.lekhsewa.backend.DTO;

import java.util.List;

public record FieldDTO(
    Long id,
    String label,
    String field_name,
    String type,
    boolean required,
    boolean nepali_text,
    List<FieldOptionDTO> options
) {}
