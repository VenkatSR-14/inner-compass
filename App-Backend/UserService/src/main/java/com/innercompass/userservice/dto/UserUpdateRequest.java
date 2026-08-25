package com.innercompass.userservice.dto;

public class UserUpdateRequest {

    private String fullName;
    private String preferredIntent;

    public UserUpdateRequest() {}

    public UserUpdateRequest(String fullName, String preferredIntent) {
        this.fullName = fullName;
        this.preferredIntent = preferredIntent;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPreferredIntent() { return preferredIntent; }
    public void setPreferredIntent(String preferredIntent) { this.preferredIntent = preferredIntent; }
}
