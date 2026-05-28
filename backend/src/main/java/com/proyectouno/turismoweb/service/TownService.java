package com.proyectouno.turismoweb.service;

import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.repository.TownRepository;
import lombok.RequiredArgsConstructor;
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
    
    public Town saveTown(Town town) {
        return townRepository.save(town);
    }
    
    public void deleteTown(Long id) {
        townRepository.deleteById(id);
    }
}
