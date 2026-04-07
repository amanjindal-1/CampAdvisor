package com.trailnest.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trailnest.api.domain.Campground;

@Repository
public interface CampgroundRepository extends JpaRepository<Campground, UUID> {

    Optional<Campground> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @Query("SELECT c FROM Campground c WHERE c.published = true ORDER BY c.createdAt DESC")
    Page<Campground> findAllPublished(Pageable pageable);

    @Query("SELECT c FROM Campground c WHERE c.author.id = :authorId ORDER BY c.createdAt DESC")
    Page<Campground> findByAuthorId(@Param("authorId") UUID authorId, Pageable pageable);

    /** Sets the PostGIS geography point for a campground after it has been saved. */
    @Modifying
    @Query(value = "UPDATE campgrounds SET coordinates = ST_Point(:lng, :lat, 4326)::geography WHERE id = :id",
            nativeQuery = true)
    void updateCoordinates(@Param("id") UUID id,
                           @Param("lat") double lat,
                           @Param("lng") double lng);

    /** Finds campgrounds within a given radius (metres) ordered by distance. */
    @Query(value = """
            SELECT * FROM campgrounds
            WHERE coordinates IS NOT NULL
              AND ST_DWithin(coordinates, ST_Point(:lng, :lat, 4326)::geography, :radiusMeters)
              AND is_published = true
            ORDER BY ST_Distance(coordinates, ST_Point(:lng, :lat, 4326)::geography)
            LIMIT :lim
            """, nativeQuery = true)
    List<Campground> findNearby(@Param("lat") double lat,
                                @Param("lng") double lng,
                                @Param("radiusMeters") double radiusMeters,
                                @Param("lim") int limit);
}
