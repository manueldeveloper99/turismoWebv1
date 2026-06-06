package com.proyectouno.turismoweb.controller;

import com.proyectouno.turismoweb.model.Place;
import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.service.PlaceService;
import com.proyectouno.turismoweb.service.TownService;
import com.proyectouno.turismoweb.service.UserService;
import com.proyectouno.turismoweb.repository.UserRepository;
import com.proyectouno.turismoweb.repository.TownRepository;
import com.proyectouno.turismoweb.repository.PlaceRepository;
import com.proyectouno.turismoweb.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final TownService townService;
    private final PlaceService placeService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final TownRepository townRepository;
    private final PlaceRepository placeRepository;
    int a;
    int u;

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

    // -- USERS --
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            User updatedUser = userService.updateRole(id, body.get("role"));
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/users/{id}/status")
    public User updateUserStatus(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        return userService.updateStatus(id, body.get("active"));
    }

    // -- STATS --
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalTowns = townRepository.count();
        long totalPlaces = placeRepository.count();
        long totalUsers = userRepository.count();

        stats.put("totalTowns", totalTowns);
        stats.put("totalPlaces", totalPlaces);
        stats.put("totalUsers", totalUsers);

        // Categorías
        List<Place> allPlaces = placeRepository.findAll();
        Map<String, Long> placesByCategory = allPlaces.stream()
                .filter(p -> p.getCategory() != null)
                .collect(Collectors.groupingBy(Place::getCategory, Collectors.counting()));
        stats.put("placesByCategory", placesByCategory);

        // Últimos agregados
        List<Place> recentPlaces = allPlaces.stream()
                .sorted((p1, p2) -> p2.getId().compareTo(p1.getId()))
                .limit(5)
                .collect(Collectors.toList());
        stats.put("recentPlaces", recentPlaces);

        return ResponseEntity.ok(stats);
    }
}
