package com.proyectouno.turismoweb.controller;

import com.proyectouno.turismoweb.model.Place;
import com.proyectouno.turismoweb.service.PlaceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.data.domain.PageImpl;

@WebMvcTest(PlaceController.class)
@AutoConfigureMockMvc(addFilters = false)
public class PlaceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PlaceService placeService;

    @Test
    void testGetPlacesByTown() throws Exception {
        Place p = new Place();
        p.setName("Mirador El Cruce");
        when(placeService.getPlacesByTownSlug(eq("santa-maria"), any(), eq(false)))
                .thenReturn(new PageImpl<>(Arrays.asList(p)));

        mockMvc.perform(get("/api/towns/santa-maria/places"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].name").value("Mirador El Cruce"));
    }

    @Test
    void testGetPlacesByTown_Empty() throws Exception {
        when(placeService.getPlacesByTownSlug(eq("empty"), any(), eq(false)))
                .thenReturn(new PageImpl<>(Collections.emptyList()));
        mockMvc.perform(get("/api/towns/empty/places")).andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(0));
    }
}