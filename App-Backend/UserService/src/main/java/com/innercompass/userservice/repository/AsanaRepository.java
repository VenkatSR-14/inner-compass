package com.innercompass.userservice.repository;

import com.innercompass.userservice.model.Asana;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface AsanaRepository extends JpaRepository<Asana, Long> {

    List<Asana> findByIntentCategory(String intentCategory);

    @Query("SELECT a FROM Asana a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(a.englishName) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(a.category) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(a.intentCategory) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Asana> searchByKeyword(@Param("q") String keyword);
}
