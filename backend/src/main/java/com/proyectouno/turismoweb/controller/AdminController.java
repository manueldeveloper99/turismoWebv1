package com.proyectouno.turismoweb.controller;

import com.proyectouno.turismoweb.model.Place;
import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.service.PlaceService;
import com.proyectouno.turismoweb.service.TownService;
import com.proyectouno.turismoweb.service.UserService;
import com.proyectouno.turismoweb.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

    @PostMapping("/towns")
    public Town createTown(@NonNull @RequestBody Town town) {
        return townService.saveTown(town);
    }

    @PutMapping("/towns/{id}")
    public Town updateTown(@NonNull @PathVariable Long id, @NonNull @RequestBody Town town) {
        town.setId(id);
        return townService.saveTown(town);
    }

    @DeleteMapping("/towns/{id}")
    public void deleteTown(@NonNull @PathVariable Long id) {
        townService.deleteTown(id);
    }

    @PostMapping("/places")
    public Place createPlace(@NonNull @RequestBody Place place) {
        return placeService.savePlace(place);
    }

    @PutMapping("/places/{id}")
    public Place updatePlace(@NonNull @PathVariable Long id, @NonNull @RequestBody Place place) {
        place.setId(id);
        return placeService.savePlace(place);
    }

    @DeleteMapping("/places/{id}")
    public void deletePlace(@NonNull @PathVariable Long id) {
        placeService.deletePlace(id);
    }

    // -- USERS --
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@NonNull @PathVariable Long id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        if (role == null) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "El campo 'role' es obligatorio.");
            return ResponseEntity.badRequest().body(error);
        }
        try {
            User updatedUser = userService.updateRole(id, role);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/users/{id}/status")
    public User updateUserStatus(@NonNull @PathVariable Long id, @RequestBody Map<String, Boolean> body) {
        Boolean active = body.get("active");
        if (active == null) {
            throw new IllegalArgumentException("El campo 'active' no puede ser nulo.");
        }
        return userService.updateStatus(id, active);
    }

    // -- STATS --
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();

        long totalTowns = townService.countTowns();
        long totalPlaces = placeService.countPlaces();
        long totalUsers = userService.countUsers();

        stats.put("totalTowns", totalTowns);
        stats.put("totalPlaces", totalPlaces);
        stats.put("totalUsers", totalUsers);

        // Categorías
        List<Place> allPlaces = placeService.getAllPlaces();
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
