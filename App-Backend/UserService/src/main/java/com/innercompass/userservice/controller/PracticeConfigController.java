package com.innercompass.userservice.controller;

import com.innercompass.userservice.dto.PracticeConfigDTO;
import com.innercompass.userservice.service.PracticeConfigService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/practice")
@CrossOrigin(origins = "*")
public class PracticeConfigController {

    private final PracticeConfigService practiceConfigService;

    public PracticeConfigController(PracticeConfigService practiceConfigService) {
        this.practiceConfigService = practiceConfigService;
    }

    @GetMapping("/configs")
    public ResponseEntity<List<PracticeConfigDTO>> getAllConfigs() {
        return ResponseEntity.ok(practiceConfigService.getAllConfigs());
    }

    @GetMapping("/configs/{intentKey}")
    public ResponseEntity<PracticeConfigDTO> getConfigByIntentKey(@PathVariable String intentKey) {
        return ResponseEntity.ok(practiceConfigService.getConfigByIntentKey(intentKey));
    }
}
