package com.lekhsewa.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name="app_user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppUser {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long id;

    @Column(name="auth0_sub", nullable = false,  unique = true)
    private String auth0Sub;

    private String email;
    private String full_name;

    @Column(name="email_verified")
    private Boolean emailVerified = false;

    @Column(name="created_at", insertable=false, updatable=false)
    private OffsetDateTime createdAt;

    @Column(name="updated_at", insertable=false)
    private OffsetDateTime updatedAt;
}
