package com.innercompass.userservice.dto;

import java.util.List;
import java.util.Map;

/**
 * Full asana detail DTO — returned by GET /api/v1/asanas/{id}.
 * Includes steps, muscles, benefits, alignment cues, 3D model URL.
 */
public class AsanaDetailDTO {
    private Long id;
    private String name;
    private String englishName;
    private String intentCategory;
    private String difficulty;
    private String category;
    private String holdTime;
    private String biomechanics;
    private String model3dUrl;
    private String thumbnailUrl;
    private List<String> contraindications;
    private List<String> steps;
    private List<String> muscles;
    private List<String> benefits;
    private Map<Integer, AlignmentAngleDTO> alignmentCues;

    public AsanaDetailDTO() {}

    // Getters and setters
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

    public String getBiomechanics() { return biomechanics; }
    public void setBiomechanics(String biomechanics) { this.biomechanics = biomechanics; }

    public String getModel3dUrl() { return model3dUrl; }
    public void setModel3dUrl(String model3dUrl) { this.model3dUrl = model3dUrl; }

    public String getThumbnailUrl() { return thumbnailUrl; }
    public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }

    public List<String> getContraindications() { return contraindications; }
    public void setContraindications(List<String> contraindications) { this.contraindications = contraindications; }

    public List<String> getSteps() { return steps; }
    public void setSteps(List<String> steps) { this.steps = steps; }

    public List<String> getMuscles() { return muscles; }
    public void setMuscles(List<String> muscles) { this.muscles = muscles; }

    public List<String> getBenefits() { return benefits; }
    public void setBenefits(List<String> benefits) { this.benefits = benefits; }

    public Map<Integer, AlignmentAngleDTO> getAlignmentCues() { return alignmentCues; }
    public void setAlignmentCues(Map<Integer, AlignmentAngleDTO> alignmentCues) { this.alignmentCues = alignmentCues; }

    /**
     * Nested DTO representing alignment cues for a single angle.
     */
    public static class AlignmentAngleDTO {
        private String viewLabel;
        private List<String> cues;

        public AlignmentAngleDTO() {}

        public AlignmentAngleDTO(String viewLabel, List<String> cues) {
            this.viewLabel = viewLabel;
            this.cues = cues;
        }

        public String getViewLabel() { return viewLabel; }
        public void setViewLabel(String viewLabel) { this.viewLabel = viewLabel; }

        public List<String> getCues() { return cues; }
        public void setCues(List<String> cues) { this.cues = cues; }
    }
}
