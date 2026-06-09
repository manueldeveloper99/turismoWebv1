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
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PlaceServiceTest {

    @Mock
    private PlaceRepository placeRepository;

    @InjectMocks
    private PlaceService placeService;

    private Place place1;
    private Town town;

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
        when(placeRepository.findByTownSlug("santa-maria")).thenReturn(Arrays.asList(place1));

        List<Place> results = placeService.getPlacesByTownSlug("santa-maria");

        assertEquals(1, results.size());
        assertEquals("Mirador", results.get(0).getName());
        verify(placeRepository).findByTownSlug("santa-maria");
    }

    @Test
    void testGetPlacesByTownSlug_NotFound() {
        when(placeRepository.findByTownSlug("unknown")).thenReturn(Collections.emptyList());

        List<Place> results = placeService.getPlacesByTownSlug("unknown");

        assertTrue(results.isEmpty());
        verify(placeRepository).findByTownSlug("unknown");
    }

    @Test
    void testSavePlace() {
        when(placeRepository.save(any(Place.class))).thenReturn(place1);

        Place savedPlace = placeService.savePlace(place1);

        assertNotNull(savedPlace);
        assertEquals("Mirador", savedPlace.getName());
        verify(placeRepository).save(place1);
    }
}
