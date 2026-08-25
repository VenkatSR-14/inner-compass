package com.innercompass.userservice.dto;

import com.innercompass.userservice.model.User;
import java.time.LocalDateTime;

public class UserResponseDTO {

    private Long id;
    private String email;
    private String fullName;
    private String preferredIntent;
    private LocalDateTime createdAt;

    public UserResponseDTO() {}

    public UserResponseDTO(Long id, String email, String fullName, String preferredIntent, LocalDateTime createdAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.preferredIntent = preferredIntent;
        this.createdAt = createdAt;
    }

    public static UserResponseDTO fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return new UserResponseDTO(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPreferredIntent(),
                user.getCreatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPreferredIntent() { return preferredIntent; }
    public void setPreferredIntent(String preferredIntent) { this.preferredIntent = preferredIntent; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
