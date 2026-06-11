package com.proyectouno.turismoweb.controller;

import com.proyectouno.turismoweb.model.User;
import com.proyectouno.turismoweb.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();
        if (jwt != null) {
            String email = jwt.getClaimAsString("email");
            String name = jwt.getClaimAsString("name");
            String picture = jwt.getClaimAsString("picture");

            // Buscar en BD o auto-registrar
            User user = userService.getOrCreateUser(email, name, picture);

            response.put("email", user.getEmail());
            response.put("name", user.getName());
            response.put("picture", user.getPictureUrl());
            response.put("role", user.getRole());
            response.put("active", user.getActive());
        }
        return response;
    }
}
