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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = new User(1L, "user@example.com", "encodedPassword123", "Jane Doe", "Equanimity");
        sampleUser.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void registerUser_Success() {
        UserRegisterRequest request = new UserRegisterRequest("user@example.com", "password123", "Jane Doe", "Equanimity");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword123");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        UserResponseDTO response = userService.registerUser(request);

        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("user@example.com");
        assertThat(response.getFullName()).isEqualTo("Jane Doe");
        assertThat(response.getPreferredIntent()).isEqualTo("Equanimity");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void registerUser_ThrowsEmailAlreadyExistsException() {
        UserRegisterRequest request = new UserRegisterRequest("user@example.com", "password123", "Jane Doe", "Equanimity");

        when(userRepository.existsByEmail("user@example.com")).thenReturn(true);

        assertThatThrownBy(() -> userService.registerUser(request))
                .isInstanceOf(EmailAlreadyExistsException.class)
                .hasMessageContaining("Email 'user@example.com' is already registered!");

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void loginUser_Success() {
        UserLoginRequest request = new UserLoginRequest("user@example.com", "password123");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("password123", "encodedPassword123")).thenReturn(true);

        UserResponseDTO response = userService.loginUser(request);

        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo("user@example.com");
    }

    @Test
    void loginUser_ThrowsInvalidCredentialsException_WhenPasswordMismatch() {
        UserLoginRequest request = new UserLoginRequest("user@example.com", "wrongPassword");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword123")).thenReturn(false);

        assertThatThrownBy(() -> userService.loginUser(request))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Invalid email or password!");
    }

    @Test
    void loginUser_ThrowsInvalidCredentialsException_WhenUserNotFound() {
        UserLoginRequest request = new UserLoginRequest("nonexistent@example.com", "password123");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.loginUser(request))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    void getUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        UserResponseDTO response = userService.getUserById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
    }

    @Test
    void getUserById_ThrowsUserNotFoundException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserById(99L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessageContaining("User not found with id: 99");
    }

    @Test
    void getAllUsers_Success() {
        when(userRepository.findAll()).thenReturn(List.of(sampleUser));

        List<UserResponseDTO> users = userService.getAllUsers();

        assertThat(users).hasSize(1);
        assertThat(users.get(0).getEmail()).isEqualTo("user@example.com");
    }

    @Test
    void updateUser_Success() {
        UserUpdateRequest updateRequest = new UserUpdateRequest("Updated Name", "Clarity");

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);

        UserResponseDTO response = userService.updateUser(1L, updateRequest);

        assertThat(response).isNotNull();
        verify(userRepository, times(1)).save(sampleUser);
    }

    @Test
    void deleteUser_Success() {
        when(userRepository.existsById(1L)).thenReturn(true);

        userService.deleteUser(1L);

        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteUser_ThrowsUserNotFoundException() {
        when(userRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> userService.deleteUser(99L))
                .isInstanceOf(UserNotFoundException.class);

        verify(userRepository, never()).deleteById(99L);
    }
}
