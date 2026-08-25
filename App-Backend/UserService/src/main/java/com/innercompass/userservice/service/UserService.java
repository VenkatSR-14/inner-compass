package com.innercompass.userservice.service;

import com.innercompass.userservice.dto.UserLoginRequest;
import com.innercompass.userservice.dto.UserRegisterRequest;
import com.innercompass.userservice.dto.UserResponseDTO;
import com.innercompass.userservice.dto.UserUpdateRequest;
import com.innercompass.userservice.exception.EmailAlreadyExistsException;
import com.innercompass.userservice.exception.InvalidCredentialsException;
import com.innercompass.userservice.exception.UserNotFoundException;
import com.innercompass.userservice.model.User;
import com.innercompass.userservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponseDTO registerUser(UserRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email '" + request.getEmail() + "' is already registered!");
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User(
                null,
                request.getEmail(),
                encodedPassword,
                request.getFullName(),
                request.getPreferredIntent()
        );

        User savedUser = userRepository.save(user);
        return UserResponseDTO.fromEntity(savedUser);
    }

    public UserResponseDTO loginUser(UserLoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password!"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password!");
        }

        return UserResponseDTO.fromEntity(user);
    }

    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return UserResponseDTO.fromEntity(user);
    }

    public UserResponseDTO getUserByName(String name) {
        User user = userRepository.findByFullName(name)
                .orElseThrow(() -> new UserNotFoundException("User not found with name: " + name));
        return UserResponseDTO.fromEntity(user);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponseDTO::fromEntity)
                .toList();
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            user.setFullName(request.getFullName());
        }
        if (request.getPreferredIntent() != null && !request.getPreferredIntent().isBlank()) {
            user.setPreferredIntent(request.getPreferredIntent());
        }

        User updatedUser = userRepository.save(user);
        return UserResponseDTO.fromEntity(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
}
