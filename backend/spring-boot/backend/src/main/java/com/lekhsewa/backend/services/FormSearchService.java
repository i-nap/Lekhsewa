// src/main/java/com/yourapp/forms/FormSearchService.java
package com.lekhsewa.backend.services;

import com.lekhsewa.backend.DTO.FormSummary;
import com.lekhsewa.backend.model.Form;
import com.lekhsewa.backend.repository.FormRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class FormSearchService {
  private final FormRepository repo;

  public FormSearchService(FormRepository repo) {
    this.repo = repo;
  }

  public Page<FormSummary> search(String rawQ, int page, int size) {
    String q = safe(rawQ);
    Pageable pageable = PageRequest.of(Math.max(page, 0), clamp(size, 1, 100), Sort.by("name").ascending());
    Page<Form> res = repo.searchByNameContains(q, pageable);
    return res.map(f -> new FormSummary(f.getId(), f.getName(), f.getDescription()));
  }

  public Page<FormSummary> suggest(String rawQ, int limit) {
    String q = safe(rawQ);
    Pageable pageable = PageRequest.of(0, clamp(limit, 1, 20), Sort.by("name").ascending());
    Page<Form> res = repo.suggestByNamePrefix(q, pageable);
    return res.map(f -> new FormSummary(f.getId(), f.getName(), f.getDescription()));
  }

  private static int clamp(int v, int min, int max) { return Math.max(min, Math.min(max, v)); }
  private static String safe(String s) { return s == null ? "" : s.trim(); }
}
