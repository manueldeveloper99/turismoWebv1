package com.proyectouno.turismoweb.service;

import com.proyectouno.turismoweb.model.User;
import com.proyectouno.turismoweb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateRole(Long id, String role) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        
        // Evitar que el último admin se quite a sí mismo los privilegios
        if ("ROLE_ADMIN".equals(user.getRole()) && !"ROLE_ADMIN".equals(role)) {
            long adminCount = userRepository.countByRole("ROLE_ADMIN");
            if (adminCount <= 1) {
                throw new RuntimeException("No puedes degradar al único administrador del sistema.");
            }
        }
        
        user.setRole(role);
        return userRepository.save(user);
    }

    public User updateStatus(Long id, Boolean active) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(active);
        return userRepository.save(user);
    }
}
