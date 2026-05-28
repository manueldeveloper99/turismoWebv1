package com.proyectouno.turismoweb.controller;

import com.proyectouno.turismoweb.model.Place;
import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.service.PlaceService;
import com.proyectouno.turismoweb.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final TownService townService;
    private final PlaceService placeService;

    @PostMapping("/towns")
    public Town createTown(@RequestBody Town town) {
        return townService.saveTown(town);
    }

    @PutMapping("/towns/{id}")
    public Town updateTown(@PathVariable Long id, @RequestBody Town town) {
        town.setId(id);
        return townService.saveTown(town);
    }

    @DeleteMapping("/towns/{id}")
    public void deleteTown(@PathVariable Long id) {
        townService.deleteTown(id);
    }

    @PostMapping("/places")
    public Place createPlace(@RequestBody Place place) {
        return placeService.savePlace(place);
    }

    @PutMapping("/places/{id}")
    public Place updatePlace(@PathVariable Long id, @RequestBody Place place) {
        place.setId(id);
        return placeService.savePlace(place);
    }

    @DeleteMapping("/places/{id}")
    public void deletePlace(@PathVariable Long id) {
        placeService.deletePlace(id);
    }
}
