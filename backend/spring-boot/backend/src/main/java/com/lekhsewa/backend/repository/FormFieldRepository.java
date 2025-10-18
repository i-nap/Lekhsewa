package com.lekhsewa.backend.repository;

import com.lekhsewa.backend.model.FormField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FormFieldRepository extends JpaRepository<FormField, Long> {
  List<FormField> findByFormIdOrderByIdAsc(Long formId);
  boolean existsByFormIdAndFieldName(Long formId, String fieldName);
}
