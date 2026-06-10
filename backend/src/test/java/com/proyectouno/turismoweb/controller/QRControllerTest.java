package com.proyectouno.turismoweb.controller;

import com.proyectouno.turismoweb.model.Town;
import com.proyectouno.turismoweb.service.TownService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(QRController.class)
@AutoConfigureMockMvc(addFilters = false)
public class QRControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TownService townService;

    @Test
    void testGenerateQR_Success() throws Exception {
        Town town = new Town();
        town.setSlug("test-town");
        when(townService.getTownBySlug("test-town")).thenReturn(Optional.of(town));

        mockMvc.perform(get("/api/qr/test-town"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_PNG_VALUE));
    }

    @Test
    void testGenerateQR_NotFound() throws Exception {
        when(townService.getTownBySlug("unknown")).thenReturn(Optional.empty());
        mockMvc.perform(get("/api/qr/unknown")).andExpect(status().isNotFound());
    }
}