package com.innercompass.userservice.service;

import com.innercompass.userservice.dto.AsanaDetailDTO;
import com.innercompass.userservice.dto.AsanaSummaryDTO;
import java.util.List;

public interface AsanaService {
    List<AsanaSummaryDTO> getAllAsanas();
    AsanaDetailDTO getAsanaById(Long id);
    List<AsanaSummaryDTO> getAsanasByIntent(String intent);
    List<AsanaSummaryDTO> searchAsanas(String keyword);
}
