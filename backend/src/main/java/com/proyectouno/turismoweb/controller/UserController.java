package com.proyectouno.turismoweb.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> user = new HashMap<>();
        if (jwt != null) {
            user.put("email", jwt.getClaimAsString("email"));
            user.put("name", jwt.getClaimAsString("name"));
            user.put("picture", jwt.getClaimAsString("picture"));
        }
        return user;
    }
}
