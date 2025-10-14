package com.lekhsewa.backend.config;// JwtConfig.java
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.*;

@org.springframework.context.annotation.Configuration
public class JwtConfig {
  private static final String ISSUER = "https://dev-8tdgsuaod7wuib3a.us.auth0.com/";
  private static final String AUDIENCE = "https://dev-8tdgsuaod7wuib3a.us.auth0.com/api/v2/";

  @Bean
  JwtDecoder jwtDecoder() {
    NimbusJwtDecoder decoder = JwtDecoders.fromIssuerLocation(ISSUER);
    OAuth2TokenValidator<Jwt> withIssuer = JwtValidators.createDefaultWithIssuer(ISSUER);
    OAuth2TokenValidator<Jwt> audience = token ->
      token.getAudience().contains(AUDIENCE)
        ? OAuth2TokenValidatorResult.success()
        : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token","audience mismatch",null));
    decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(withIssuer, audience));
    return decoder;
  }
}
