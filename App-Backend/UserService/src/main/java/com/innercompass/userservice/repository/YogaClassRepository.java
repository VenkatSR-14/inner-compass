package com.innercompass.userservice.repository;

import com.innercompass.userservice.model.YogaClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface YogaClassRepository extends JpaRepository<YogaClass, Long> {

    List<YogaClass> findByIntentCategory(String intentCategory);

    @Query("SELECT c FROM YogaClass c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(c.description) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(c.instructorName) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(c.intentCategory) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<YogaClass> searchByKeyword(@Param("q") String keyword);
}
