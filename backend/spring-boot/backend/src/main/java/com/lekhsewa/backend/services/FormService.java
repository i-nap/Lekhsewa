package com.lekhsewa.backend.services;

import com.lekhsewa.backend.DTO.*;
import com.lekhsewa.backend.model.FieldOption;
import com.lekhsewa.backend.model.Form;
import com.lekhsewa.backend.model.FormField;
import com.lekhsewa.backend.repository.FormRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FormService {
  private final FormRepository repo;

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

  public FormDataCombinedDTO getForm(Long id){
      Form f = repo.findGraphById(id)
              .orElseThrow(() -> new IllegalArgumentException("Form not found: " + id));

      FormDTO formDTO = new FormDTO(f.getId(), f.getName(), f.getDescription());
      var fieldComparator = Comparator.comparingLong(FormField::getId);
      var optionComparator = Comparator.comparingLong(FieldOption::getId);

      List<FieldDTO> fields = f.getFields().stream()
              .sorted(fieldComparator)
              .map(ff -> new FieldDTO(
                      ff.getId(),
                      ff.getLabel(),
                      ff.getFieldName(),
                      ff.getType(),
                      ff.isRequired(),
                      ff.isNepaliText(),
                      ff.getOptions().stream()
                              .sorted(optionComparator)
                              .map(opt -> new FieldOptionDTO(opt.getValue(), opt.getLabel()))
                              .toList()
              ))
              .toList();

      return new FormDataCombinedDTO(formDTO, fields);
  }

  private static int clamp(int v, int min, int max) {
      return Math.max(min, Math.min(max, v));
  }

  private static String safe(String s) {
      return s == null ? "" : s.trim();
  }
}
