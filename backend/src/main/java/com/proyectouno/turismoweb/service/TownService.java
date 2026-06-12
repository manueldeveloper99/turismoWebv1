package com.proyectouno.turismoweb.service;

import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.repository.TownRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TownService {
    private final TownRepository townRepository;

    public List<Town> getAllTowns() {
        return townRepository.findAll();
    }

    public Optional<Town> getTownBySlug(String slug) {
        return townRepository.findBySlug(slug);
    }

    public Town saveTown(@NonNull Town town) {
        return townRepository.save(town);
    }

    public void deleteTown(@NonNull Long id) {
        townRepository.deleteById(id);
    }

    public long countTowns() {
        return townRepository.count();
    }
}
