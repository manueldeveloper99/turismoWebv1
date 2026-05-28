package com.proyectouno.turismoweb.repository;

import com.proyectouno.turismoweb.model.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByTownId(Long townId);
    List<Place> findByTownSlug(String townSlug);
}
