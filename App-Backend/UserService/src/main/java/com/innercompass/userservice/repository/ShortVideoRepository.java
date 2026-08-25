package com.innercompass.userservice.repository;

import com.innercompass.userservice.model.ShortVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShortVideoRepository extends JpaRepository<ShortVideo, Long> {
    List<ShortVideo> findAllByOrderByCreatedAtDesc();
    List<ShortVideo> findByIntentCategoryOrderByCreatedAtDesc(String intentCategory);
}
