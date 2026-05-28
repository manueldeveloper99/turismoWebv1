package com.proyectouno.turismoweb.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "towns")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Town {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String slug; // URL friendly identifier, e.g., "santa-maria"

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;
}
