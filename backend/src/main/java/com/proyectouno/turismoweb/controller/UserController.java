package com.proyectouno.turismoweb.controller;

import com.proyectouno.turismoweb.model.User;
import com.proyectouno.turismoweb.repository.UserRepository;
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

    private final UserRepository userRepository;

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        Map<String, Object> response = new HashMap<>();
        if (jwt != null) {
            String email = jwt.getClaimAsString("email");
            String name = jwt.getClaimAsString("name");
            String picture = jwt.getClaimAsString("picture");

            // Buscar en BD o auto-registrar
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = User.builder()
                        .email(email)
                        .name(name)
                        .pictureUrl(picture)
                        // Si es el primer usuario en la BD, lo hacemos ADMIN, sino USER
                        .role(userRepository.count() == 0 ? "ROLE_ADMIN" : "ROLE_USER")
                        .active(true)
                        .build();
                return userRepository.save(newUser);
            });

            response.put("email", user.getEmail());
            response.put("name", user.getName());
            response.put("picture", user.getPictureUrl());
            response.put("role", user.getRole());
            response.put("active", user.getActive());
        }
        return response;
    }
}
