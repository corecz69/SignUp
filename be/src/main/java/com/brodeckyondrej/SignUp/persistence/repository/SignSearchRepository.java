package com.brodeckyondrej.SignUp.persistence.repository;

import com.brodeckyondrej.SignUp.persistence.entity.Sign;
import com.brodeckyondrej.SignUp.persistence.entity.SignComponent;
import com.brodeckyondrej.SignUp.persistence.enumerated.LanguageLevel;
import com.brodeckyondrej.SignUp.persistence.enumerated.Region;
import com.brodeckyondrej.SignUp.persistence.enumerated.SignType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository for advanced sign search operations with optimized queries.
 * Uses native queries and indexes for better performance on large datasets.
 */
@Repository
public interface SignSearchRepository extends JpaRepository<Sign, UUID> {

    /**
     * Search signs by text in translations with full-text search optimization.
     */
    @Query(value = """
        SELECT DISTINCT s.* FROM sign s
        LEFT JOIN sign_translations st ON s.id = st.sign_id
        WHERE LOWER(st.translations) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(s.explanation) LIKE LOWER(CONCAT('%', :query, '%'))
        ORDER BY
            CASE WHEN LOWER(st.translations) = LOWER(:query) THEN 1 ELSE 2 END,
            CASE WHEN LOWER(st.translations) LIKE LOWER(CONCAT(:query, '%')) THEN 1 ELSE 2 END,
            LENGTH(st.translations)
        """, nativeQuery = true)
    Page<Sign> findByTranslationText(@Param("query") String query, Pageable pageable);

    /**
     * Find signs by multiple component criteria for advanced filtering.
     */
    @Query("""
        SELECT s FROM Sign s
        WHERE (:categoryId IS NULL OR s.category.id = :categoryId)
        AND (:signType IS NULL OR s.type = :signType)
        AND (:languageLevel IS NULL OR s.languageLevel = :languageLevel)
        AND (:region IS NULL OR s.region = :region)
        AND (:handShapeId IS NULL OR s.handShape.id = :handShapeId)
        AND (:locationId IS NULL OR s.location.id = :locationId)
        AND (:movementId IS NULL OR s.movementComponent.id = :movementId)
        AND (:palmOrientationId IS NULL OR s.palmOrientation.id = :palmOrientationId)
        AND (:fingerOrientationId IS NULL OR s.fingerOrientation.id = :fingerOrientationId)
        AND (:contactRegionId IS NULL OR s.contactRegion.id = :contactRegionId)
        AND (:handArrangementId IS NULL OR s.handArrangement.id = :handArrangementId)
        ORDER BY s.category.name, s.type
        """)
    Page<Sign> findByMultipleCriteria(
        @Param("categoryId") UUID categoryId,
        @Param("signType") SignType signType,
        @Param("languageLevel") LanguageLevel languageLevel,
        @Param("region") Region region,
        @Param("handShapeId") UUID handShapeId,
        @Param("locationId") UUID locationId,
        @Param("movementId") UUID movementId,
        @Param("palmOrientationId") UUID palmOrientationId,
        @Param("fingerOrientationId") UUID fingerOrientationId,
        @Param("contactRegionId") UUID contactRegionId,
        @Param("handArrangementId") UUID handArrangementId,
        Pageable pageable
    );

    /**
     * Find signs with similar movement patterns based on component matching.
     */
    @Query("""
        SELECT s FROM Sign s
        WHERE s.id != :excludeId
        AND (
            (s.movementComponent = :movementComponent AND :movementComponent IS NOT NULL) OR
            (s.handShape = :handShape AND :handShape IS NOT NULL) OR
            (s.location = :location AND :location IS NOT NULL) OR
            (s.palmOrientation = :palmOrientation AND :palmOrientation IS NOT NULL) OR
            (s.fingerOrientation = :fingerOrientation AND :fingerOrientation IS NOT NULL)
        )
        ORDER BY
            CASE WHEN s.movementComponent = :movementComponent THEN 3 ELSE 0 END +
            CASE WHEN s.handShape = :handShape THEN 2 ELSE 0 END +
            CASE WHEN s.location = :location THEN 2 ELSE 0 END +
            CASE WHEN s.palmOrientation = :palmOrientation THEN 1 ELSE 0 END +
            CASE WHEN s.fingerOrientation = :fingerOrientation THEN 1 ELSE 0 END DESC
        """)
    Page<Sign> findSimilarSigns(
        @Param("excludeId") UUID excludeId,
        @Param("movementComponent") SignComponent movementComponent,
        @Param("handShape") SignComponent handShape,
        @Param("location") SignComponent location,
        @Param("palmOrientation") SignComponent palmOrientation,
        @Param("fingerOrientation") SignComponent fingerOrientation,
        Pageable pageable
    );

    /**
     * Get popular search terms for autocomplete.
     */
    @Query(value = """
        SELECT DISTINCT st.translations as suggestion
        FROM sign_translations st
        WHERE LOWER(st.translations) LIKE LOWER(CONCAT(:query, '%'))
        AND LENGTH(st.translations) <= 50
        ORDER BY LENGTH(st.translations), st.translations
        LIMIT 10
        """, nativeQuery = true)
    List<String> findTranslationSuggestions(@Param("query") String query);

    /**
     * Count signs by category for statistics.
     */
    @Query("""
        SELECT c.name, COUNT(s)
        FROM Sign s
        JOIN s.category c
        GROUP BY c.id, c.name
        ORDER BY COUNT(s) DESC
        """)
    List<Object[]> getSignCountByCategory();

    /**
     * Find recently added signs for homepage.
     */
    @Query("""
        SELECT s FROM Sign s
        ORDER BY s.createdAt DESC
        """)
    Page<Sign> findRecentSigns(Pageable pageable);

    /**
     * Find signs by language level with category distribution.
     */
    @Query("""
        SELECT s FROM Sign s
        WHERE s.languageLevel = :level
        ORDER BY s.category.name, s.type
        """)
    Page<Sign> findByLanguageLevel(@Param("level") LanguageLevel level, Pageable pageable);

    /**
     * Search for signs that contain all provided translation terms.
     */
    @Query(value = """
        SELECT DISTINCT s.* FROM sign s
        JOIN sign_translations st ON s.id = st.sign_id
        WHERE st.sign_id IN (
            SELECT st2.sign_id
            FROM sign_translations st2
            WHERE LOWER(st2.translations) LIKE LOWER(CONCAT('%', :term1, '%'))
        )
        AND (:term2 IS NULL OR st.sign_id IN (
            SELECT st3.sign_id
            FROM sign_translations st3
            WHERE LOWER(st3.translations) LIKE LOWER(CONCAT('%', :term2, '%'))
        ))
        AND (:term3 IS NULL OR st.sign_id IN (
            SELECT st4.sign_id
            FROM sign_translations st4
            WHERE LOWER(st4.translations) LIKE LOWER(CONCAT('%', :term3, '%'))
        ))
        ORDER BY s.created_at DESC
        """, nativeQuery = true)
    Page<Sign> findByMultipleTerms(
        @Param("term1") String term1,
        @Param("term2") String term2,
        @Param("term3") String term3,
        Pageable pageable
    );
}