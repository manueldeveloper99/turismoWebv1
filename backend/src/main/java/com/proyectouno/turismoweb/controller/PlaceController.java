package com.proyectouno.turismoweb.controller;

import com.proyectouno.turismoweb.model.Place;
import com.proyectouno.turismoweb.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@RestController
@RequestMapping("/api/towns/{slug}/places")
@RequiredArgsConstructor
public class PlaceController {
    private final PlaceService placeService;

    @GetMapping
    public List<Place> getPlacesByTown(@PathVariable String slug) {
        return placeService.getPlacesByTownSlug(slug);
    }
}
