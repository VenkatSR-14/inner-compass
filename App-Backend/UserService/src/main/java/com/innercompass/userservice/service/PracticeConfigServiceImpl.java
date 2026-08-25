package com.innercompass.userservice.service;

import com.innercompass.userservice.dto.PracticeConfigDTO;
import com.innercompass.userservice.model.Asana;
import com.innercompass.userservice.model.AsanaStep;
import com.innercompass.userservice.model.PracticeConfig;
import com.innercompass.userservice.repository.PracticeConfigRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PracticeConfigServiceImpl implements PracticeConfigService {

    private final PracticeConfigRepository practiceConfigRepository;

    public PracticeConfigServiceImpl(PracticeConfigRepository practiceConfigRepository) {
        this.practiceConfigRepository = practiceConfigRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PracticeConfigDTO> getAllConfigs() {
        return practiceConfigRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PracticeConfigDTO getConfigByIntentKey(String intentKey) {
        PracticeConfig config = practiceConfigRepository.findByIntentKey(intentKey)
                .orElseThrow(() -> new RuntimeException("Practice config not found for intent: " + intentKey));
        return toDTO(config);
    }

    private PracticeConfigDTO toDTO(PracticeConfig config) {
        PracticeConfigDTO dto = new PracticeConfigDTO();
        dto.setId(config.getId());
        dto.setIntentKey(config.getIntentKey());
        dto.setTitle(config.getTitle());
        dto.setCognitiveFraming(config.getCognitiveFraming());
        dto.setBreathInhaleSecs(config.getBreathInhaleSecs());
        dto.setBreathHoldSecs(config.getBreathHoldSecs());
        dto.setBreathExhaleSecs(config.getBreathExhaleSecs());
        dto.setBreathName(config.getBreathName());
        dto.setDefaultDurationSecs(config.getDefaultDurationSecs());

        Asana asana = config.getAsana();
        if (asana != null) {
            dto.setAsanaId(asana.getId());
            dto.setAsanaName(asana.getName());
            dto.setAsanaEnglishName(asana.getEnglishName());
            dto.setBiomechanics(asana.getBiomechanics());

            if (asana.getSteps() != null) {
                dto.setSteps(asana.getSteps().stream()
                        .map(AsanaStep::getInstruction)
                        .collect(Collectors.toList()));
            } else {
                dto.setSteps(Collections.emptyList());
            }
        }
        return dto;
    }
}
