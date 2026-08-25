package com.innercompass.userservice.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "asana_steps", schema = "content_schema")
public class AsanaStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asana_id", nullable = false)
    @JsonIgnore
    private Asana asana;

    @Column(name = "step_order", nullable = false)
    private Integer stepOrder;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String instruction;

    public AsanaStep() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Asana getAsana() { return asana; }
    public void setAsana(Asana asana) { this.asana = asana; }

    public Integer getStepOrder() { return stepOrder; }
    public void setStepOrder(Integer stepOrder) { this.stepOrder = stepOrder; }

    public String getInstruction() { return instruction; }
    public void setInstruction(String instruction) { this.instruction = instruction; }
}
