package com.brodeckyondrej.SignUp.api.controller;

import com.brodeckyondrej.SignUp.business.dto.sign.SignGetListDto;
import com.brodeckyondrej.SignUp.business.service.sign.SignService;
import com.brodeckyondrej.SignUp.persistence.enumerated.LanguageLevel;
import com.brodeckyondrej.SignUp.persistence.enumerated.Region;
import com.brodeckyondrej.SignUp.persistence.enumerated.SignType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Advanced search controller for finding signs based on multiple criteria.
 * Supports text search, component-based search, and advanced filtering.
 */
@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class SearchController {

    private final SignService signService;

    /**
     * Advanced search for signs with multiple filter options.
     * Combines text search with component-based filtering.
     */
    @GetMapping("/signs")
    public ResponseEntity<Page<SignGetListDto>> searchSigns(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) SignType signType,
            @RequestParam(required = false) LanguageLevel languageLevel,
            @RequestParam(required = false) Region region,
            @RequestParam(required = false) UUID handShapeId,
            @RequestParam(required = false) UUID locationId,
            @RequestParam(required = false) UUID movementId,
            @RequestParam(required = false) UUID palmOrientationId,
            @RequestParam(required = false) UUID fingerOrientationId,
            @RequestParam(required = false) UUID contactRegionId,
            @RequestParam(required = false) UUID handArrangementId,
            Pageable pageable) {

        Page<SignGetListDto> results = signService.advancedSearch(
            query, categoryId, signType, languageLevel, region,
            handShapeId, locationId, movementId, palmOrientationId,
            fingerOrientationId, contactRegionId, handArrangementId,
            pageable
        );

        return ResponseEntity.ok(results);
    }

    /**
     * Quick text search across sign translations and explanations.
     */
    @GetMapping("/signs/quick")
    public ResponseEntity<Page<SignGetListDto>> quickSearch(
            @RequestParam String query,
            Pageable pageable) {

        Page<SignGetListDto> results = signService.quickTextSearch(query, pageable);
        return ResponseEntity.ok(results);
    }

    /**
     * Search signs by similarity to specific movement patterns.
     * Useful for finding signs with similar hand movements.
     */
    @GetMapping("/signs/similar-movement")
    public ResponseEntity<Page<SignGetListDto>> findSimilarMovement(
            @RequestParam UUID signId,
            Pageable pageable) {

        Page<SignGetListDto> results = signService.findSignsWithSimilarMovement(signId, pageable);
        return ResponseEntity.ok(results);
    }

    /**
     * Get search suggestions based on partial query.
     */
    @GetMapping("/suggestions")
    public ResponseEntity<?> getSearchSuggestions(@RequestParam String query) {
        var suggestions = signService.getSearchSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }
}