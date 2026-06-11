package com.proyectouno.turismoweb.repository;

import com.proyectouno.turismoweb.model.Place;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaceRepository extends JpaRepository<Place, Long> {
    Page<Place> findByTownId(Long townId, Pageable pageable);
    Page<Place> findByTownSlug(String townSlug, Pageable pageable);
    Page<Place> findByTownSlugAndActiveTrue(String townSlug, Pageable pageable);
}
