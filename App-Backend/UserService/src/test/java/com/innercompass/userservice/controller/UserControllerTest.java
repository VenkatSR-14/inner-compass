package com.innercompass.userservice.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.innercompass.userservice.dto.UserLoginRequest;
import com.innercompass.userservice.dto.UserRegisterRequest;
import com.innercompass.userservice.dto.UserResponseDTO;
import com.innercompass.userservice.exception.GlobalExceptionHandler;
import com.innercompass.userservice.exception.UserNotFoundException;
import com.innercompass.userservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private UserResponseDTO sampleResponse;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        sampleResponse = new UserResponseDTO(1L, "user@example.com", "Jane Doe", "Equanimity", LocalDateTime.now());
    }

    @Test
    void healthCheck_ReturnsOk() throws Exception {
        mockMvc.perform(get("/api/v1/users/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("UserService is running smoothly!"));
    }

    @Test
    void registerUser_ReturnsStatus201_WhenPayloadValid() throws Exception {
        UserRegisterRequest request = new UserRegisterRequest("user@example.com", "password123", "Jane Doe", "Equanimity");

        when(userService.registerUser(any(UserRegisterRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/v1/users/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.fullName").value("Jane Doe"));
    }

    @Test
    void loginUser_ReturnsStatus200_WhenCredentialsValid() throws Exception {
        UserLoginRequest loginRequest = new UserLoginRequest("user@example.com", "password123");

        when(userService.loginUser(any(UserLoginRequest.class))).thenReturn(sampleResponse);

        mockMvc.perform(post("/api/v1/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("user@example.com"));
    }

    @Test
    void getAllUsers_ReturnsStatus200() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of(sampleResponse));

        mockMvc.perform(get("/api/v1/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("user@example.com"));
    }

    @Test
    void getUserById_ReturnsStatus200() throws Exception {
        when(userService.getUserById(1L)).thenReturn(sampleResponse);

        mockMvc.perform(get("/api/v1/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void getUserById_ReturnsStatus404_WhenUserNotFound() throws Exception {
        when(userService.getUserById(99L)).thenThrow(new UserNotFoundException("User not found with id: 99"));

        mockMvc.perform(get("/api/v1/users/99"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("User not found with id: 99"));
    }

    @Test
    void deleteUser_ReturnsStatus204() throws Exception {
        mockMvc.perform(delete("/api/v1/users/1"))
                .andExpect(status().isNoContent());
    }
}
