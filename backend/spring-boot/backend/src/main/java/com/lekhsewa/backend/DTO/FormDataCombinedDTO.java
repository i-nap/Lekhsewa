package com.lekhsewa.backend.DTO;

import java.util.List;

public record FormDataCombinedDTO(
        FormDTO form,
        List<FieldDTO> fields
) {}
