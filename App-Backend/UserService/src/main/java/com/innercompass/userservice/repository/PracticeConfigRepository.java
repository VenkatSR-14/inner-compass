package com.innercompass.userservice.repository;

import com.innercompass.userservice.model.PracticeConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PracticeConfigRepository extends JpaRepository<PracticeConfig, Long> {
    Optional<PracticeConfig> findByIntentKey(String intentKey);
}
