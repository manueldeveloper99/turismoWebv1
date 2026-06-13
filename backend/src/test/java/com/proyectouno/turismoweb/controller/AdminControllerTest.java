package com.proyectouno.turismoweb.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.proyectouno.turismoweb.model.Place;
import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.model.User;
import com.proyectouno.turismoweb.service.PlaceService;
import com.proyectouno.turismoweb.service.TownService;
import com.proyectouno.turismoweb.service.UserService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TownService townService;
    @MockBean
    private PlaceService placeService;
    @MockBean
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

    @Test
    void testUpdateTown() throws Exception {
        Town town = new Town();
        town.setId(1L);
        town.setName("Updated");
        when(townService.saveTown(any(Town.class))).thenReturn(town);

        mockMvc.perform(put("/api/admin/towns/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(town)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated"));
    }

    @Test
    void testDeleteTown() throws Exception {
        doNothing().when(townService).deleteTown(1L);
        mockMvc.perform(delete("/api/admin/towns/1"))
                .andExpect(status().isOk());
        verify(townService).deleteTown(1L);
    }

    @Test
    void testCreatePlace() throws Exception {
        Place place = new Place();
        place.setName("Nuevo Lugar");
        when(placeService.savePlace(any(Place.class))).thenReturn(place);

        mockMvc.perform(post("/api/admin/places")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(place)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Nuevo Lugar"));
    }

    @Test
    void testUpdatePlace() throws Exception {
        Place place = new Place();
        place.setId(1L);
        place.setName("Lugar Actualizado");
        when(placeService.savePlace(any(Place.class))).thenReturn(place);

        mockMvc.perform(put("/api/admin/places/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(place)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Lugar Actualizado"));
    }

    @Test
    void testDeletePlace() throws Exception {
        doNothing().when(placeService).deletePlace(1L);
        mockMvc.perform(delete("/api/admin/places/1"))
                .andExpect(status().isOk());
        verify(placeService).deletePlace(1L);
    }

    @Test
    void testGetAllUsers() throws Exception {
        User user = new User();
        user.setEmail("test@test.com");
        when(userService.getAllUsers()).thenReturn(Arrays.asList(user));

        mockMvc.perform(get("/api/admin/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("test@test.com"));
    }

    @Test
    void testUpdateUserStatus() throws Exception {
        User user = new User();
        user.setActive(false);
        when(userService.updateStatus(eq(1L), eq(false))).thenReturn(user);

        mockMvc.perform(put("/api/admin/users/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("active", false))))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateUserStatusNull() throws Exception {
        mockMvc.perform(put("/api/admin/users/1/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of())))
                .andExpect(status().isBadRequest()); // O lo que lance tu GlobalExceptionHandler (IllegalArgumentException a menudo da 400 o 500)
    }

    @Test
    void testUpdateUserRole() throws Exception {
        User user = new User();
        user.setRole("ADMIN");
        when(userService.updateRole(eq(1L), eq("ADMIN"))).thenReturn(user);

        mockMvc.perform(put("/api/admin/users/1/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("role", "ADMIN"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("ADMIN"));
    }

    @Test
    void testUpdateUserRoleNull() throws Exception {
        mockMvc.perform(put("/api/admin/users/1/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    void testUpdateUserRoleException() throws Exception {
        when(userService.updateRole(eq(1L), eq("INVALID"))).thenThrow(new RuntimeException("Rol invalido"));

        mockMvc.perform(put("/api/admin/users/1/role")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("role", "INVALID"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Rol invalido"));
    }

    /**
     * Test para verificar las estadísticas.
     * Valida la integración con el repositorio mockeado.
     */
    @Test
    void testGetStats() throws Exception {
        when(townService.countTowns()).thenReturn(5L);
        when(placeService.countPlaces()).thenReturn(10L);
        when(userService.countUsers()).thenReturn(2L);
        when(placeService.getAllPlaces()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/admin/stats")).andExpect(status().isOk())
                .andExpect(jsonPath("$.totalTowns").value(5));
    }
}
