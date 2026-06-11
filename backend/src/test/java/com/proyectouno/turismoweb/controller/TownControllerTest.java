package com.proyectouno.turismoweb.controller;

import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.service.TownService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TownController.class)
@AutoConfigureMockMvc(addFilters = false)
public class TownControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TownService townService;

    @Test
    void testGetAllTowns() throws Exception {
        Town t1 = new Town();
        t1.setName("Santa Maria");
        Town t2 = new Town();
        t2.setName("San Marcos");

        when(townService.getAllTowns()).thenReturn(Arrays.asList(t1, t2));

        mockMvc.perform(get("/api/towns"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Santa Maria"));
    }

    @Test
    void testGetTownBySlug_Found() throws Exception {
        Town town = new Town();
        town.setSlug("santa-maria");
        town.setName("Santa Maria");

        when(townService.getTownBySlug("santa-maria")).thenReturn(Optional.of(town));

        mockMvc.perform(get("/api/towns/santa-maria"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Santa Maria"));
    }

    @Test
    void testGetTownBySlug_NotFound() throws Exception {
        when(townService.getTownBySlug("unknown")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/towns/unknown"))
                .andExpect(status().isNotFound());
    }
}