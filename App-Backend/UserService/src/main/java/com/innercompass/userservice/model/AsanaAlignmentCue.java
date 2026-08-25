package com.innercompass.userservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "asana_alignment_cues", schema = "content_schema")
public class AsanaAlignmentCue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asana_id", nullable = false)
    @JsonIgnore
    private Asana asana;

    @Column(name = "angle_degrees", nullable = false)
    private Integer angleDegrees;

    @Column(name = "view_label", nullable = false, length = 60)
    private String viewLabel;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String cue;

    public AsanaAlignmentCue() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Asana getAsana() { return asana; }
    public void setAsana(Asana asana) { this.asana = asana; }

    public Integer getAngleDegrees() { return angleDegrees; }
    public void setAngleDegrees(Integer angleDegrees) { this.angleDegrees = angleDegrees; }

    public String getViewLabel() { return viewLabel; }
    public void setViewLabel(String viewLabel) { this.viewLabel = viewLabel; }

    public String getCue() { return cue; }
    public void setCue(String cue) { this.cue = cue; }
}
