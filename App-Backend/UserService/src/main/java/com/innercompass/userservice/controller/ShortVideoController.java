package com.innercompass.userservice.controller;

import com.innercompass.userservice.dto.ClipResponseDTO;
import com.innercompass.userservice.dto.CreateClipRequest;
import com.innercompass.userservice.service.ShortVideoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v1/clips")
public class ShortVideoController {

    private final ShortVideoService shortVideoService;

    public ShortVideoController(ShortVideoService shortVideoService) {
        this.shortVideoService = shortVideoService;
    }

    @GetMapping
    public ResponseEntity<List<ClipResponseDTO>> getAllClips() {
        return ResponseEntity.ok(shortVideoService.getAllClips());
    }

    @GetMapping("/intent/{intent}")
    public ResponseEntity<List<ClipResponseDTO>> getClipsByIntent(@PathVariable String intent) {
        return ResponseEntity.ok(shortVideoService.getClipsByIntent(intent));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClipResponseDTO> getClipById(@PathVariable Long id) {
        return ResponseEntity.ok(shortVideoService.getClipById(id));
    }

    @PostMapping
    public ResponseEntity<ClipResponseDTO> createClip(@Valid @RequestBody CreateClipRequest request) {
        ClipResponseDTO created = shortVideoService.createClip(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ClipResponseDTO> likeClip(@PathVariable Long id) {
        return ResponseEntity.ok(shortVideoService.likeClip(id));
    }
}
