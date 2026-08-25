package com.innercompass.userservice.service;

import com.innercompass.userservice.dto.ClipResponseDTO;
import com.innercompass.userservice.dto.CreateClipRequest;
import com.innercompass.userservice.exception.UserNotFoundException;
import com.innercompass.userservice.model.ShortVideo;
import com.innercompass.userservice.repository.ShortVideoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShortVideoServiceImpl implements ShortVideoService {

    private final ShortVideoRepository shortVideoRepository;

    public ShortVideoServiceImpl(ShortVideoRepository shortVideoRepository) {
        this.shortVideoRepository = shortVideoRepository;
    }

    @Override
    public List<ClipResponseDTO> getAllClips() {
        return shortVideoRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(ClipResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public List<ClipResponseDTO> getClipsByIntent(String intent) {
        return shortVideoRepository.findByIntentCategoryOrderByCreatedAtDesc(intent).stream()
                .map(ClipResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public ClipResponseDTO getClipById(Long id) {
        ShortVideo video = shortVideoRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Mindful Clip not found with id: " + id));
        return ClipResponseDTO.fromEntity(video);
    }

    @Override
    @Transactional
    public ClipResponseDTO createClip(CreateClipRequest request) {
        ShortVideo video = new ShortVideo(
                null,
                request.getTitle(),
                request.getDescription(),
                request.getVideoUrl(),
                request.getThumbnailUrl(),
                request.getDurationSeconds(),
                request.getIntentCategory(),
                request.getAuthorId(),
                request.getAuthorName() != null ? request.getAuthorName() : "Inner Compass Guide"
        );

        ShortVideo saved = shortVideoRepository.save(video);
        return ClipResponseDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public ClipResponseDTO likeClip(Long id) {
        ShortVideo video = shortVideoRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Mindful Clip not found with id: " + id));

        video.setLikesCount(video.getLikesCount() + 1);
        ShortVideo updated = shortVideoRepository.save(video);
        return ClipResponseDTO.fromEntity(updated);
    }
}
