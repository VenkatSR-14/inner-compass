package com.innercompass.userservice.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "asanas", schema = "content_schema")
public class Asana {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "english_name", nullable = false, length = 100)
    private String englishName;

    @Column(name = "intent_category", nullable = false, length = 50)
    private String intentCategory;

    @Column(nullable = false, length = 30)
    private String difficulty;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(name = "hold_time", length = 30)
    private String holdTime;

    @Column(columnDefinition = "TEXT")
    private String biomechanics;

    @Column(name = "model_3d_url", length = 512)
    private String model3dUrl;

    @Column(name = "thumbnail_url", length = 512)
    private String thumbnailUrl;

    @Column(name = "contraindications", columnDefinition = "TEXT[]")
    private String[] contraindications;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "asana", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("stepOrder ASC")
    private List<AsanaStep> steps;

    @OneToMany(mappedBy = "asana", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AsanaMuscle> muscles;

    @OneToMany(mappedBy = "asana", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<AsanaBenefit> benefits;

    @OneToMany(mappedBy = "asana", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("angleDegrees ASC")
    private List<AsanaAlignmentCue> alignmentCues;

    public Asana() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
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

    public String[] getContraindications() { return contraindications; }
    public void setContraindications(String[] contraindications) { this.contraindications = contraindications; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public List<AsanaStep> getSteps() { return steps; }
    public void setSteps(List<AsanaStep> steps) { this.steps = steps; }

    public List<AsanaMuscle> getMuscles() { return muscles; }
    public void setMuscles(List<AsanaMuscle> muscles) { this.muscles = muscles; }

    public List<AsanaBenefit> getBenefits() { return benefits; }
    public void setBenefits(List<AsanaBenefit> benefits) { this.benefits = benefits; }

    public List<AsanaAlignmentCue> getAlignmentCues() { return alignmentCues; }
    public void setAlignmentCues(List<AsanaAlignmentCue> alignmentCues) { this.alignmentCues = alignmentCues; }
}
