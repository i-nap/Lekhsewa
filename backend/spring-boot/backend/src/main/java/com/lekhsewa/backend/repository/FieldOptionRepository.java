package com.lekhsewa.backend.repository;

import com.lekhsewa.backend.model.FieldOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FieldOptionRepository extends JpaRepository<FieldOption, Long> {
  List<FieldOption> findByFieldIdOrderByIdAsc(Long fieldId);
  boolean existsByFieldIdAndValue(Long fieldId, String value);
}
