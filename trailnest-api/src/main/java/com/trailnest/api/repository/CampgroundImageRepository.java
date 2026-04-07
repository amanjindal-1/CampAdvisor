package com.trailnest.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trailnest.api.domain.CampgroundImage;

@Repository
public interface CampgroundImageRepository extends JpaRepository<CampgroundImage, UUID> {

    List<CampgroundImage> findByCampgroundIdOrderByDisplayOrderAsc(UUID campgroundId);
}
