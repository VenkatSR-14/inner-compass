package com.innercompass.userservice.service;

import com.innercompass.userservice.dto.ClipResponseDTO;
import com.innercompass.userservice.dto.CreateClipRequest;

import java.util.List;

public interface ShortVideoService {
    List<ClipResponseDTO> getAllClips();
    List<ClipResponseDTO> getClipsByIntent(String intent);
    ClipResponseDTO getClipById(Long id);
    ClipResponseDTO createClip(CreateClipRequest request);
    ClipResponseDTO likeClip(Long id);
}
