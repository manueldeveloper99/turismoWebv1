package com.proyectouno.turismoweb.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@ActiveProfiles("test")
class SecurityConfigTest {

    @Autowired
    private SecurityFilterChain filterChain;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Test
    void testSecurityBeansLoaded() {
        assertNotNull(filterChain, "SecurityFilterChain should be loaded into context");
        assertNotNull(corsConfigurationSource, "CorsConfigurationSource should be loaded into context");
    }
}
