// src/main/java/com/yourapp/forms/FormSearchController.java
package com.lekhsewa.backend.controller;

import com.lekhsewa.backend.DTO.FormSummary;
import com.lekhsewa.backend.services.FormSearchService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/")
public class FormSearchController {
  private final FormSearchService service;

  public FormSearchController(FormSearchService service) {
    this.service = service;
  }

  @GetMapping("/search")
  public Page<FormSummary> search(
      @RequestParam(defaultValue = "") String q,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
    return service.search(q, page, size);
  }

  @GetMapping("/suggest")
  public Page<FormSummary> suggest(
      @RequestParam(defaultValue = "") String q,
      @RequestParam(defaultValue = "8") int limit
  ) {
    return service.suggest(q, limit);
  }
}
