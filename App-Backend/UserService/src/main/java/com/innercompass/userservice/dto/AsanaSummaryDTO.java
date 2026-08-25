package com.innercompass.userservice.dto;

/**
 * Lightweight asana DTO for list/search results.
 */
public class AsanaSummaryDTO {
    private Long id;
    private String name;
    private String englishName;
    private String intentCategory;
    private String difficulty;
    private String category;
    private String holdTime;
    private String thumbnailUrl;
    private boolean has3dModel;

    public AsanaSummaryDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEnglishName() { return englishName; }
    public void setEnglishName(String englishName) { this.englishName = englishName; }

    public String getIntentCategory() { return intentCategory; }
    public void setIntentCategory(String intentCategory) { this.intentCategory = intentCategory; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getHoldTime() { return holdTime; }
    public void setHoldTime(String holdTime) { this.holdTime = holdTime; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public boolean isHas3dModel() { return has3dModel; }
    public void setHas3dModel(boolean has3dModel) { this.has3dModel = has3dModel; }
}
