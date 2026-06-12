package com.proyectouno.turismoweb.service;

import com.proyectouno.turismoweb.model.User;
import com.proyectouno.turismoweb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getOrCreateUser(@NonNull String email, String name, String pictureUrl) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .name(name)
                    .pictureUrl(pictureUrl)
                    // Si es el primer usuario en la BD, lo hacemos ADMIN, sino USER
                    .role(userRepository.count() == 0 ? "ROLE_ADMIN" : "ROLE_USER")
                    .active(true)
                    .build();
            return userRepository.save(newUser);
        });
    }

    public User updateRole(@NonNull Long id, String role) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        validateLastAdmin(user, role, user.getActive());

        user.setRole(role);
        return userRepository.save(user);
    }

    public User updateStatus(@NonNull Long id, Boolean active) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        validateLastAdmin(user, user.getRole(), active);

        user.setActive(active);
        return userRepository.save(user);
    }

    public long countUsers() {
        return userRepository.count();
    }

    private void validateLastAdmin(User user, String newRole, Boolean newActiveStatus) {
        boolean isCurrentlyAdmin = "ROLE_ADMIN".equals(user.getRole());
        boolean willNotBeAdmin = !"ROLE_ADMIN".equals(newRole) || Boolean.FALSE.equals(newActiveStatus);

        if (isCurrentlyAdmin && willNotBeAdmin) {
            if (userRepository.countByRole("ROLE_ADMIN") <= 1) {
                throw new RuntimeException("Operación denegada: "
                        + "El sistema debe tener al menos un administrador activo.");
            }
        }
    }
}
