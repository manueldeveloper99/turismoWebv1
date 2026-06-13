package com.proyectouno.turismoweb.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PlaceTest {

    @Test
    void testPlaceGettersAndSetters() {
        Town town = new Town();
        town.setId(1L);

        Place place = new Place();
        place.setId(10L);
        place.setName("Mirador Test");
        place.setDescription("A beautiful place");
        place.setCategory("Mirador");
        place.setAddress("123 Main St");
        place.setImageUrl("http://image.com/img.png");
        place.setLatitude(9.9281);
        place.setLongitude(-84.0907);
        place.setActive(true);
        place.setTown(town);

        assertEquals(10L, place.getId());
        assertEquals("Mirador Test", place.getName());
        assertEquals("A beautiful place", place.getDescription());
        assertEquals("Mirador", place.getCategory());
        assertEquals("123 Main St", place.getAddress());
        assertEquals("http://image.com/img.png", place.getImageUrl());
        assertEquals(9.9281, place.getLatitude());
        assertEquals(-84.0907, place.getLongitude());
        assertTrue(place.getActive());
        assertEquals(town, place.getTown());
    }

    @Test
    void testPlaceAllArgsConstructorAndBuilder() {
        Town town = new Town();
        town.setId(1L);

        Place place = Place.builder()
                .id(20L)
                .name("Restaurante Test")
                .description("Good food")
                .category("Restaurante")
                .address("456 Food Ave")
                .imageUrl("http://image.com/food.png")
                .latitude(10.0)
                .longitude(-85.0)
                .active(false)
                .town(town)
                .build();

        assertEquals(20L, place.getId());
        assertEquals("Restaurante Test", place.getName());
        assertFalse(place.getActive());

        Place place2 = new Place(20L, "Restaurante Test", "Good food", "Restaurante", "456 Food Ave", "http://image.com/food.png", 10.0, -85.0, false, town);
        assertEquals(place, place2);
        assertEquals(place.hashCode(), place2.hashCode());
        assertNotNull(place.toString());
    }
}
