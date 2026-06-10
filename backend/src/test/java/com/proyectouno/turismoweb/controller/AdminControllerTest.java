package com.proyectouno.turismoweb.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.service.PlaceService;
import com.proyectouno.turismoweb.service.TownService;
import com.proyectouno.turismoweb.service.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private TownService townService;
    @MockitoBean
    private PlaceService placeService;
    @MockitoBean
    private UserService userService;

    /**
     * Test para verificar la creación de un pueblo.
     * Valida que el endpoint responda 200 OK y devuelva el slug correcto.
     */
    @Test
    void testCreateTown() throws Exception {
        Town town = new Town();
        town.setName("Dota");
        town.setSlug("dota");
        when(townService.saveTown(any(Town.class))).thenReturn(town);

        mockMvc.perform(post("/api/admin/towns")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(town)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("dota"));
    }

    /**
     * Test para verificar las estadísticas.
     * Valida la integración con el repositorio mockeado.
     */
    @Test
    void testGetStats() throws Exception {
        when(townService.countTowns()).thenReturn(5L);

        mockMvc.perform(get("/api/admin/stats")).andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTowns").value(5));
    }
}
