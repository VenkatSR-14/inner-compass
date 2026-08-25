package com.innercompass.userservice.service;

import com.innercompass.userservice.dto.ClipResponseDTO;
import com.innercompass.userservice.dto.CreateClipRequest;
import com.innercompass.userservice.model.ShortVideo;
import com.innercompass.userservice.repository.ShortVideoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShortVideoServiceTest {

    @Mock
    private ShortVideoRepository shortVideoRepository;

    @InjectMocks
    private ShortVideoServiceImpl shortVideoService;

    private ShortVideo sampleVideo;

    @BeforeEach
    void setUp() {
        sampleVideo = new ShortVideo(1L, "Breath Grounding", "30s calibration", "http://example.com/video.mp4",
                "http://example.com/thumb.jpg", 30, "Equanimity", 1L, "Guide");
    }

    @Test
    void createClip_Success_Within10to60Seconds() {
        CreateClipRequest request = new CreateClipRequest("Breath Grounding", "30s calibration",
                "http://example.com/video.mp4", "http://example.com/thumb.jpg", 30, "Equanimity", 1L, "Guide");

        when(shortVideoRepository.save(any(ShortVideo.class))).thenReturn(sampleVideo);

        ClipResponseDTO response = shortVideoService.createClip(request);

        assertThat(response).isNotNull();
        assertThat(response.getDurationSeconds()).isEqualTo(30);
        assertThat(response.getIntentCategory()).isEqualTo("Equanimity");
        verify(shortVideoRepository, times(1)).save(any(ShortVideo.class));
    }

    @Test
    void getAllClips_Success() {
        when(shortVideoRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(sampleVideo));

        List<ClipResponseDTO> clips = shortVideoService.getAllClips();

        assertThat(clips).hasSize(1);
        assertThat(clips.get(0).getTitle()).isEqualTo("Breath Grounding");
    }

    @Test
    void likeClip_Success() {
        when(shortVideoRepository.findById(1L)).thenReturn(Optional.of(sampleVideo));
        when(shortVideoRepository.save(any(ShortVideo.class))).thenReturn(sampleVideo);

        ClipResponseDTO response = shortVideoService.likeClip(1L);

        assertThat(response).isNotNull();
        verify(shortVideoRepository, times(1)).save(sampleVideo);
    }
}
