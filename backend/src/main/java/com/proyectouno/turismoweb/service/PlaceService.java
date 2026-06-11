package com.proyectouno.turismoweb.service;

import com.proyectouno.turismoweb.model.Place;
import com.proyectouno.turismoweb.repository.PlaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceService {
    private final PlaceRepository placeRepository;

    public List<Place> getPlacesByTownSlug(String townSlug) {
        return placeRepository.findByTownSlug(townSlug);
    }

    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    public Place savePlace(Place place) {
        return placeRepository.save(place);
    }

    public void deletePlace(Long id) {
        placeRepository.deleteById(id);
    }

    public long countPlaces() {
        return placeRepository.count();
    }
}
