package com.innercompass.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserRegisterRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email format is invalid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    private String fullName;
    private String preferredIntent;

    public UserRegisterRequest() {}

    public UserRegisterRequest(String email, String password, String fullName, String preferredIntent) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.preferredIntent = preferredIntent;
    }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPreferredIntent() { return preferredIntent; }
    public void setPreferredIntent(String preferredIntent) { this.preferredIntent = preferredIntent; }
}
