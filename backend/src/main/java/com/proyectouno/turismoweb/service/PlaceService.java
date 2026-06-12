package com.proyectouno.turismoweb.service;

import com.proyectouno.turismoweb.model.Place;
import com.proyectouno.turismoweb.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceService {
    private final PlaceRepository placeRepository;

    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    public Page<Place> getPlacesByTownSlug(@NonNull String townSlug, @NonNull Pageable pageable, boolean onlyActive) {
        if (onlyActive) {
            return placeRepository.findByTownSlugAndActiveTrue(townSlug, pageable);
        }
        return placeRepository.findByTownSlug(townSlug, pageable);
    }

    public Page<Place> getAllPlaces(@NonNull Pageable pageable) {
        return placeRepository.findAll(pageable);
    }

    public Place savePlace(@NonNull Place place) {
        return placeRepository.save(place);
    }

    public void deletePlace(@NonNull Long id) {
        placeRepository.deleteById(id);
    }

    public long countPlaces() {
        return placeRepository.count();
    }
}
