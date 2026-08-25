package com.innercompass.userservice.service;

import com.innercompass.userservice.dto.PracticeConfigDTO;
import java.util.List;

public interface PracticeConfigService {
    List<PracticeConfigDTO> getAllConfigs();
    PracticeConfigDTO getConfigByIntentKey(String intentKey);
}
