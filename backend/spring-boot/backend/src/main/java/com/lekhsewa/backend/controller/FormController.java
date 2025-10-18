package com.lekhsewa.backend.controller;

import com.lekhsewa.backend.DTO.FormDataCombinedDTO;
import com.lekhsewa.backend.DTO.FormSummary;
import com.lekhsewa.backend.services.FormService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/")
public class FormController {
  private final FormService service;

  public FormController(FormService service) {
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

  @GetMapping("/getformdata/{id}")
    public ResponseEntity<FormDataCombinedDTO> getFormData(@PathVariable Long id) {
      try {
          return ResponseEntity.ok(service.getForm(id));
      } catch (IllegalArgumentException e) {
          return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
      }
  }
}
