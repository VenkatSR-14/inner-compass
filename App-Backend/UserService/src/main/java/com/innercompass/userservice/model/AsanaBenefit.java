package com.innercompass.userservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "asana_benefits", schema = "content_schema")
public class AsanaBenefit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asana_id", nullable = false)
    @JsonIgnore
    private Asana asana;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String benefit;

    public AsanaBenefit() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Asana getAsana() { return asana; }
    public void setAsana(Asana asana) { this.asana = asana; }

    public String getBenefit() { return benefit; }
    public void setBenefit(String benefit) { this.benefit = benefit; }
}
