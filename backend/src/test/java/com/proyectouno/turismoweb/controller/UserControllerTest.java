package com.proyectouno.turismoweb.controller;

import com.proyectouno.turismoweb.model.User;
import com.proyectouno.turismoweb.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.security.oauth2.jwt.Jwt; 
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void testGetCurrentUser() throws Exception {
        User user = new User();
        user.setEmail("test@gmail.com");
        user.setName("Test User");
        user.setRole("ROLE_USER");
        user.setActive(true);

        when(userService.getOrCreateUser(anyString(), anyString(), anyString())).thenReturn(user);

        mockMvc.perform(get("/api/users/me")
                .with(jwt().jwt(j -> j.claim("email", "test@gmail.com").claim("name", "Test User").claim("picture", "url"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@gmail.com"))
                .andExpect(jsonPath("$.role").value("ROLE_USER"));
    }
}