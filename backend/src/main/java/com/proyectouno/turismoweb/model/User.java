package com.proyectouno.turismoweb.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;
    private String pictureUrl;

    @Column(nullable = false)
    private String role; // "ROLE_USER", "ROLE_ADMIN"

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
