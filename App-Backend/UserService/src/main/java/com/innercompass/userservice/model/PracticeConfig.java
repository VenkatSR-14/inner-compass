package com.innercompass.userservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "practice_configs", schema = "content_schema")
public class PracticeConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "intent_key", nullable = false, unique = true, length = 30)
    private String intentKey;

    @Column(nullable = false, length = 60)
    private String title;

    @Column(name = "cognitive_framing", nullable = false, columnDefinition = "TEXT")
    private String cognitiveFraming;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "asana_id")
    private Asana asana;

    @Column(name = "breath_inhale_secs", nullable = false)
    private Integer breathInhaleSecs;

    @Column(name = "breath_hold_secs", nullable = false)
    private Integer breathHoldSecs;

    @Column(name = "breath_exhale_secs", nullable = false)
    private Integer breathExhaleSecs;

    @Column(name = "breath_name", nullable = false, length = 60)
    private String breathName;

    @Column(name = "default_duration_secs", nullable = false)
    private Integer defaultDurationSecs;

    public PracticeConfig() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getIntentKey() { return intentKey; }
    public void setIntentKey(String intentKey) { this.intentKey = intentKey; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCognitiveFraming() { return cognitiveFraming; }
    public void setCognitiveFraming(String cognitiveFraming) { this.cognitiveFraming = cognitiveFraming; }

    public Asana getAsana() { return asana; }
    public void setAsana(Asana asana) { this.asana = asana; }

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
}
