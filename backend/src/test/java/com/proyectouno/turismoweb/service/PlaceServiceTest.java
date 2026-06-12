package com.proyectouno.turismoweb.service;

import com.proyectouno.turismoweb.model.Place;
import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.repository.PlaceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.Objects;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.lang.NonNull;

import java.util.List;

@ExtendWith(MockitoExtension.class)
public class PlaceServiceTest {

    @Mock
    private PlaceRepository placeRepository;

    @InjectMocks
    private PlaceService placeService;

    @NonNull
    private Place place1 = new Place();
    @NonNull
    private Town town = new Town();

    @BeforeEach
    void setUp() {
        town = new Town();
        town.setId(1L);
        town.setSlug("santa-maria");

        place1 = new Place();
        place1.setId(1L);
        place1.setName("Mirador");
        place1.setTown(town);
    }

    @Test
    void testGetPlacesByTownSlug_Found() {
        List<Place> content = Arrays.asList(place1);
        when(placeRepository.findByTownSlug(eq("santa-maria"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(content));

        Page<Place> results = placeService.getPlacesByTownSlug("santa-maria", Pageable.unpaged(), false);

        assertEquals(1, results.getContent().size());
        assertEquals("Mirador", results.getContent().get(0).getName());
        verify(placeRepository).findByTownSlug(eq("santa-maria"), any(Pageable.class));
    }

    @Test
    void testGetPlacesByTownSlug_NotFound() {
        List<Place> emptyList = Collections.emptyList();
        when(placeRepository.findByTownSlug(eq("unknown"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(emptyList));

        Page<Place> results = placeService.getPlacesByTownSlug("unknown", Pageable.unpaged(), false);

        assertTrue(results.isEmpty());
        verify(placeRepository).findByTownSlug(eq("unknown"), any(Pageable.class));
    }

    @Test
    void testGetPlacesByTownSlug_OnlyActive() {
        List<Place> content = Arrays.asList(place1);
        when(placeRepository.findByTownSlugAndActiveTrue(eq("santa-maria"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(content));

        Page<Place> results = placeService.getPlacesByTownSlug("santa-maria", Pageable.unpaged(), true);

        assertEquals(1, results.getContent().size());
        verify(placeRepository).findByTownSlugAndActiveTrue(eq("santa-maria"), any(Pageable.class));
    }

    @Test
    void testGetAllPlacesList() {
        when(placeRepository.findAll()).thenReturn(Arrays.asList(place1));
        java.util.List<Place> results = placeService.getAllPlaces();
        assertEquals(1, results.size());
    }

    @Test
    void testGetAllPlacesPage() {
        List<Place> content = Arrays.asList(place1);
        when(placeRepository.findAll(any(Pageable.class))).thenReturn(new PageImpl<>(content));
        Page<Place> results = placeService.getAllPlaces(Pageable.unpaged());
        assertEquals(1, results.getContent().size());
    }

    @Test
    void testSavePlace() {
        when(placeRepository.save(argThat(Objects::nonNull))).thenReturn(place1);

        Place savedPlace = placeService.savePlace(place1);

        assertNotNull(savedPlace);
        assertEquals("Mirador", savedPlace.getName());
        verify(placeRepository).save(place1);
    }

    @Test
    void testDeletePlace() {
        Long id = 1L;
        placeService.deletePlace(id);
        verify(placeRepository).deleteById(id);
    }

    @Test
    void testCountPlaces() {
        when(placeRepository.count()).thenReturn(5L);
        long count = placeService.countPlaces();
        assertEquals(5L, count);
    }
}
