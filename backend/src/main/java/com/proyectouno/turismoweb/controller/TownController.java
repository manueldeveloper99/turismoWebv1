package com.proyectouno.turismoweb.controller;

import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/towns")
@RequiredArgsConstructor
public class TownController {
    private final TownService townService;

    @GetMapping
    public List<Town> getAllTowns() {
        return townService.getAllTowns();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Town> getTownBySlug(@PathVariable String slug) {
        return townService.getTownBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
