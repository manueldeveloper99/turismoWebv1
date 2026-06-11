package com.proyectouno.turismoweb.controller;

import com.proyectouno.turismoweb.model.Place;
import com.proyectouno.turismoweb.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/towns/{slug}/places")
@RequiredArgsConstructor
public class PlaceController {
    private final PlaceService placeService;

    @GetMapping
    public Page<Place> getPlacesByTown(
            @PathVariable String slug, 
            Pageable pageable, 
            @RequestParam(defaultValue = "false") boolean onlyActive) {
        return placeService.getPlacesByTownSlug(slug, pageable, onlyActive);
    }
}
