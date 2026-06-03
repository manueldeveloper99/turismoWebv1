package com.proyectouno.turismoweb.service;

import com.proyectouno.turismoweb.model.User;
import com.proyectouno.turismoweb.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User adminUser;
    private User normalUser;

    @BeforeEach
    void setUp() {
        adminUser = new User();
        adminUser.setId(1L);
        adminUser.setEmail("admin@gmail.com");
        adminUser.setRole("ROLE_ADMIN");
        adminUser.setActive(true);

        normalUser = new User();
        normalUser.setId(2L);
        normalUser.setEmail("user@gmail.com");
        normalUser.setRole("ROLE_USER");
        normalUser.setActive(true);
    }

    @Test
    void testUpdateRole_Success() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(normalUser));
        when(userRepository.save(any(User.class))).thenReturn(normalUser);

        User updatedUser = userService.updateRole(2L, "ROLE_ADMIN");

        assertEquals("ROLE_ADMIN", updatedUser.getRole());
        verify(userRepository).save(normalUser);
    }

    @Test
    void testUpdateRole_LastAdminThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(adminUser));
        when(userRepository.countByRole("ROLE_ADMIN")).thenReturn(1L);

        Exception exception = assertThrows(RuntimeException.class, () -> {
            userService.updateRole(1L, "ROLE_USER");
        });

        assertTrue(exception.getMessage().contains("El sistema debe tener al menos un administrador activo"));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testUpdateStatus_Success() {
        when(userRepository.findById(2L)).thenReturn(Optional.of(normalUser));
        when(userRepository.save(any(User.class))).thenReturn(normalUser);

        User updatedUser = userService.updateStatus(2L, false);

        assertFalse(updatedUser.getActive());
        verify(userRepository).save(normalUser);
    }
}
