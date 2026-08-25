package com.innercompass.userservice.service;

import com.innercompass.userservice.dto.UserLoginRequest;
import com.innercompass.userservice.dto.UserRegisterRequest;
import com.innercompass.userservice.dto.UserResponseDTO;
import com.innercompass.userservice.dto.UserUpdateRequest;

import java.util.List;

public interface UserService {
    UserResponseDTO registerUser(UserRegisterRequest request);
    UserResponseDTO loginUser(UserLoginRequest request);
    UserResponseDTO getUserById(Long id);
    UserResponseDTO getUserByName(String name);
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO updateUser(Long id, UserUpdateRequest request);
    void deleteUser(Long id);
}
