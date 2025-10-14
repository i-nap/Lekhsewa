package com.lekhsewa.backend.controller;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;

@RestController
@RequestMapping("/api/me")
public class MeSyncController {
  private final JdbcTemplate jdbc;
  public MeSyncController(JdbcTemplate jdbc) { this.jdbc = jdbc; }

  @PostMapping("/sync")
  @Transactional
  public Map<String, Object> sync(@AuthenticationPrincipal Jwt jwt) {
    String sub = jwt.getSubject();
    String email = jwt.getClaimAsString("email");
    String full_name = jwt.getClaimAsString("full_name");
    String picture = jwt.getClaimAsString("picture");
    boolean verified = Boolean.TRUE.equals(jwt.getClaim("email_verified"));
    System.out.println("chaliracha");
    jdbc.queryForObject(
      """
      INSERT INTO app_user (auth0_sub, email, full_name, email_verified)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT (auth0_sub) DO UPDATE
        SET email = EXCLUDED.email,
            full_name = EXCLUDED.full_name,
            email_verified = EXCLUDED.email_verified
      RETURNING id
      """,
      Long.class, sub, email, full_name, picture, verified
    );

    return Map.of("sub", sub, "email", email, "full_name", full_name, "email_verified", verified);
  }
}
