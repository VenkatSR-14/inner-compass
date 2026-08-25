package com.innercompass.userservice.controller;

import com.innercompass.userservice.dto.AsanaDetailDTO;
import com.innercompass.userservice.dto.AsanaSummaryDTO;
import com.innercompass.userservice.service.AsanaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/asanas")
@CrossOrigin(origins = "*")
public class AsanaController {

    private final AsanaService asanaService;

    public AsanaController(AsanaService asanaService) {
        this.asanaService = asanaService;
    }

    @GetMapping
    public ResponseEntity<List<AsanaSummaryDTO>> getAllAsanas() {
        return ResponseEntity.ok(asanaService.getAllAsanas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsanaDetailDTO> getAsanaById(@PathVariable Long id) {
        return ResponseEntity.ok(asanaService.getAsanaById(id));
    }

    @GetMapping("/intent/{intent}")
    public ResponseEntity<List<AsanaSummaryDTO>> getAsanasByIntent(@PathVariable String intent) {
        return ResponseEntity.ok(asanaService.getAsanasByIntent(intent));
    }

    @GetMapping("/search")
    public ResponseEntity<List<AsanaSummaryDTO>> searchAsanas(@RequestParam String q) {
        return ResponseEntity.ok(asanaService.searchAsanas(q));
    }
}
