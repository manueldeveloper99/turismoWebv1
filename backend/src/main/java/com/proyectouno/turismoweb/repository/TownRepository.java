package com.proyectouno.turismoweb.repository;

import com.proyectouno.turismoweb.model.Town;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TownRepository extends JpaRepository<Town, Long> {
    Optional<Town> findBySlug(String slug);
}
