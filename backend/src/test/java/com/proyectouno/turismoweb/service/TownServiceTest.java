package com.proyectouno.turismoweb.service;

import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.repository.TownRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TownServiceTest {

    @Mock
    private TownRepository townRepository;

    @InjectMocks
    private TownService townService;

    private Town town1;
    private Town town2;

    @BeforeEach
    void setUp() {
        town1 = new Town();
        town1.setId(1L);
        town1.setName("Santa María");
        town1.setSlug("santa-maria");

        town2 = new Town();
        town2.setId(2L);
        town2.setName("San José");
        town2.setSlug("san-jose");
    }

    @Test
    void testGetAllTowns() {
        when(townRepository.findAll()).thenReturn(Arrays.asList(town1, town2));

        List<Town> result = townService.getAllTowns();

        assertEquals(2, result.size());
        assertEquals("Santa María", result.get(0).getName());
        verify(townRepository).findAll();
    }

    @Test
    void testGetTownBySlug_Found() {
        when(townRepository.findBySlug("santa-maria")).thenReturn(Optional.of(town1));

        Optional<Town> result = townService.getTownBySlug("santa-maria");

        assertTrue(result.isPresent());
        assertEquals("Santa María", result.get().getName());
        verify(townRepository).findBySlug("santa-maria");
    }

    @Test
    void testGetTownBySlug_NotFound() {
        when(townRepository.findBySlug("unknown")).thenReturn(Optional.empty());

        Optional<Town> result = townService.getTownBySlug("unknown");

        assertFalse(result.isPresent());
        verify(townRepository).findBySlug("unknown");
    }
}
