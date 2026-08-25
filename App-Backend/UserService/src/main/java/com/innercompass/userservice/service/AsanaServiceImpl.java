package com.innercompass.userservice.service;

import com.innercompass.userservice.dto.AsanaDetailDTO;
import com.innercompass.userservice.dto.AsanaSummaryDTO;
import com.innercompass.userservice.model.*;
import com.innercompass.userservice.repository.AsanaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AsanaServiceImpl implements AsanaService {

    private final AsanaRepository asanaRepository;

    public AsanaServiceImpl(AsanaRepository asanaRepository) {
        this.asanaRepository = asanaRepository;
    }

    @Override
    public List<AsanaSummaryDTO> getAllAsanas() {
        return asanaRepository.findAll().stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AsanaDetailDTO getAsanaById(Long id) {
        Asana asana = asanaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asana not found with id: " + id));
        return toDetail(asana);
    }

    @Override
    public List<AsanaSummaryDTO> getAsanasByIntent(String intent) {
        return asanaRepository.findByIntentCategory(intent).stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    @Override
    public List<AsanaSummaryDTO> searchAsanas(String keyword) {
        return asanaRepository.searchByKeyword(keyword).stream()
                .map(this::toSummary)
                .collect(Collectors.toList());
    }

    private AsanaSummaryDTO toSummary(Asana asana) {
        AsanaSummaryDTO dto = new AsanaSummaryDTO();
        dto.setId(asana.getId());
        dto.setName(asana.getName());
        dto.setEnglishName(asana.getEnglishName());
        dto.setIntentCategory(asana.getIntentCategory());
        dto.setDifficulty(asana.getDifficulty());
        dto.setCategory(asana.getCategory());
        dto.setHoldTime(asana.getHoldTime());
        dto.setThumbnailUrl(asana.getThumbnailUrl());
        dto.setHas3dModel(asana.getModel3dUrl() != null && !asana.getModel3dUrl().isBlank());
        return dto;
    }

    private AsanaDetailDTO toDetail(Asana asana) {
        AsanaDetailDTO dto = new AsanaDetailDTO();
        dto.setId(asana.getId());
        dto.setName(asana.getName());
        dto.setEnglishName(asana.getEnglishName());
        dto.setIntentCategory(asana.getIntentCategory());
        dto.setDifficulty(asana.getDifficulty());
        dto.setCategory(asana.getCategory());
        dto.setHoldTime(asana.getHoldTime());
        dto.setBiomechanics(asana.getBiomechanics());
        dto.setModel3dUrl(asana.getModel3dUrl());
        dto.setThumbnailUrl(asana.getThumbnailUrl());

        // Contraindications
        if (asana.getContraindications() != null) {
            dto.setContraindications(Arrays.asList(asana.getContraindications()));
        } else {
            dto.setContraindications(Collections.emptyList());
        }

        // Steps (ordered)
        if (asana.getSteps() != null) {
            dto.setSteps(asana.getSteps().stream()
                    .map(AsanaStep::getInstruction)
                    .collect(Collectors.toList()));
        }

        // Muscles
        if (asana.getMuscles() != null) {
            dto.setMuscles(asana.getMuscles().stream()
                    .map(AsanaMuscle::getMuscleName)
                    .collect(Collectors.toList()));
        }

        // Benefits
        if (asana.getBenefits() != null) {
            dto.setBenefits(asana.getBenefits().stream()
                    .map(AsanaBenefit::getBenefit)
                    .collect(Collectors.toList()));
        }

        // Alignment Cues — grouped by angle
        if (asana.getAlignmentCues() != null) {
            Map<Integer, AsanaDetailDTO.AlignmentAngleDTO> cueMap = new LinkedHashMap<>();
            for (AsanaAlignmentCue cue : asana.getAlignmentCues()) {
                cueMap.computeIfAbsent(cue.getAngleDegrees(), k ->
                        new AsanaDetailDTO.AlignmentAngleDTO(cue.getViewLabel(), new ArrayList<>())
                );
                cueMap.get(cue.getAngleDegrees()).getCues().add(cue.getCue());
            }
            dto.setAlignmentCues(cueMap);
        }

        return dto;
    }
}
