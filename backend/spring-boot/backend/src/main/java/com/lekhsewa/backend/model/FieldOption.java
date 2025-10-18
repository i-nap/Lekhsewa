package com.lekhsewa.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
  name = "field_options"
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FieldOption {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "field_id", nullable = false,
              foreignKey = @ForeignKey(name = "fk_field_options_field"))
  private FormField field;

  @Column(name = "opt_value", nullable = false, length = 255)
  private String value;

  @Column(name = "opt_label", nullable = false, length = 255)
  private String label;
}
