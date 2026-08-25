package com.innercompass.userservice.dto;

import com.innercompass.userservice.model.ShortVideo;
import java.time.LocalDateTime;

public class ClipResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String videoUrl;
    private String thumbnailUrl;
    private Integer durationSeconds;
    private String intentCategory;
    private Long authorId;
    private String authorName;
    private Long likesCount;
    private Long viewsCount;
    private LocalDateTime createdAt;

    public ClipResponseDTO() {}

    public ClipResponseDTO(Long id, String title, String description, String videoUrl, String thumbnailUrl,
                           Integer durationSeconds, String intentCategory, Long authorId, String authorName,
                           Long likesCount, Long viewsCount, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.thumbnailUrl = thumbnailUrl;
        this.durationSeconds = durationSeconds;
        this.intentCategory = intentCategory;
        this.authorId = authorId;
        this.authorName = authorName;
        this.likesCount = likesCount;
        this.viewsCount = viewsCount;
        this.createdAt = createdAt;
    }

    public static ClipResponseDTO fromEntity(ShortVideo video) {
        if (video == null) return null;
        return new ClipResponseDTO(
                video.getId(),
                video.getTitle(),
                video.getDescription(),
                video.getVideoUrl(),
                video.getThumbnailUrl(),
                video.getDurationSeconds(),
                video.getIntentCategory(),
                video.getAuthorId(),
                video.getAuthorName(),
                video.getLikesCount(),
                video.getViewsCount(),
                video.getCreatedAt()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Long getLikesCount() { return likesCount; }
    public void setLikesCount(Long likesCount) { this.likesCount = likesCount; }

    public Long getViewsCount() { return viewsCount; }
    public void setViewsCount(Long viewsCount) { this.viewsCount = viewsCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
