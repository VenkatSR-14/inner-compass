package com.innercompass.userservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "asana_muscles", schema = "content_schema")
public class AsanaMuscle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asana_id", nullable = false)
    @JsonIgnore
    private Asana asana;

    @Column(name = "muscle_name", nullable = false, length = 100)
    private String muscleName;

    public AsanaMuscle() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Asana getAsana() { return asana; }
    public void setAsana(Asana asana) { this.asana = asana; }

    public String getMuscleName() { return muscleName; }
    public void setMuscleName(String muscleName) { this.muscleName = muscleName; }
}
