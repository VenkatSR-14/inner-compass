package com.innercompass.userservice.dto;

/**
 * DTO for practice configuration API responses.
 */
public class PracticeConfigDTO {
    private Long id;
    private String intentKey;
    private String title;
    private String cognitiveFraming;
    private Long asanaId;
    private String asanaName;
    private String asanaEnglishName;
    private Integer breathInhaleSecs;
    private Integer breathHoldSecs;
    private Integer breathExhaleSecs;
    private String breathName;
    private Integer defaultDurationSecs;
    // Inline science & steps for the practice engine
    private String biomechanics;
    private java.util.List<String> steps;

    public PracticeConfigDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIntentKey() { return intentKey; }
    public void setIntentKey(String intentKey) { this.intentKey = intentKey; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCognitiveFraming() { return cognitiveFraming; }
    public void setCognitiveFraming(String cognitiveFraming) { this.cognitiveFraming = cognitiveFraming; }

    public Long getAsanaId() { return asanaId; }
    public void setAsanaId(Long asanaId) { this.asanaId = asanaId; }

    public String getAsanaName() { return asanaName; }
    public void setAsanaName(String asanaName) { this.asanaName = asanaName; }

    public String getAsanaEnglishName() { return asanaEnglishName; }
    public void setAsanaEnglishName(String asanaEnglishName) { this.asanaEnglishName = asanaEnglishName; }

    public Integer getBreathInhaleSecs() { return breathInhaleSecs; }
    public void setBreathInhaleSecs(Integer breathInhaleSecs) { this.breathInhaleSecs = breathInhaleSecs; }

    public Integer getBreathHoldSecs() { return breathHoldSecs; }
    public void setBreathHoldSecs(Integer breathHoldSecs) { this.breathHoldSecs = breathHoldSecs; }

    public Integer getBreathExhaleSecs() { return breathExhaleSecs; }
    public void setBreathExhaleSecs(Integer breathExhaleSecs) { this.breathExhaleSecs = breathExhaleSecs; }

    public String getBreathName() { return breathName; }
    public void setBreathName(String breathName) { this.breathName = breathName; }

    public Integer getDefaultDurationSecs() { return defaultDurationSecs; }
    public void setDefaultDurationSecs(Integer defaultDurationSecs) { this.defaultDurationSecs = defaultDurationSecs; }

    public String getBiomechanics() { return biomechanics; }
    public void setBiomechanics(String biomechanics) { this.biomechanics = biomechanics; }

    public java.util.List<String> getSteps() { return steps; }
    public void setSteps(java.util.List<String> steps) { this.steps = steps; }
}
