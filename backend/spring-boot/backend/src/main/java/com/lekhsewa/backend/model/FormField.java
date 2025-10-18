package com.lekhsewa.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
  name = "form_fields"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FormField {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "form_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_form_fields_form"))
  private Form form;

  @Column(nullable = false, length = 255)
  private String label;

  @Column(name = "field_name", nullable = false, length = 255)
  private String fieldName;

  @Column(name = "type", nullable = false, length = 255)
  private String type;

  @Column(nullable = false)
  private boolean required = false;

  @Column(name = "nepali_text", nullable = false)
  private boolean nepaliText = false;

  @OneToMany(mappedBy = "field", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<FieldOption> options = new ArrayList<>();

}
