package com.innercompass.userservice.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateClipRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 120, message = "Title cannot exceed 120 characters")
    private String title;

    private String description;

    @NotBlank(message = "Video URL is required")
    private String videoUrl;

    private String thumbnailUrl;

    @NotNull(message = "Duration is required")
    @Min(value = 10, message = "Video duration must be at least 10 seconds")
    @Max(value = 60, message = "Video duration cannot exceed 60 seconds")
    private Integer durationSeconds;

    @NotBlank(message = "Intent category is required")
    private String intentCategory;

    @NotNull(message = "Author ID is required")
    private Long authorId;

    private String authorName;

    public CreateClipRequest() {}

    public CreateClipRequest(String title, String description, String videoUrl, String thumbnailUrl,
                             Integer durationSeconds, String intentCategory, Long authorId, String authorName) {
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.durationSeconds = durationSeconds;
        this.intentCategory = intentCategory;
        this.authorId = authorId;
        this.authorName = authorName;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public String getIntentCategory() { return intentCategory; }
    public void setIntentCategory(String intentCategory) { this.intentCategory = intentCategory; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
}
