package com.brodeckyondrej.SignUp.business.service.sign;

import com.brodeckyondrej.SignUp.business.dto.sign.CreateSignDto;
import com.brodeckyondrej.SignUp.business.dto.sign.SignGetDetailDto;
import com.brodeckyondrej.SignUp.business.dto.sign.SignGetListDto;
import com.brodeckyondrej.SignUp.business.dto.sign.UpdateSignDto;
import com.brodeckyondrej.SignUp.business.service.storage.FileSystemVideoStorage;
import com.brodeckyondrej.SignUp.business.service.universal.EntityService;
import com.brodeckyondrej.SignUp.persistence.entity.Category;
import com.brodeckyondrej.SignUp.persistence.entity.PrivateCollection;
import com.brodeckyondrej.SignUp.persistence.entity.Sign;
import com.brodeckyondrej.SignUp.persistence.entity.SignComponent;
import com.brodeckyondrej.SignUp.persistence.enumerated.LanguageLevel;
import com.brodeckyondrej.SignUp.persistence.enumerated.Region;
import com.brodeckyondrej.SignUp.persistence.enumerated.SignType;
import com.brodeckyondrej.SignUp.persistence.repository.CategoryRepository;
import com.brodeckyondrej.SignUp.persistence.repository.PrivateCollectionRepository;
import com.brodeckyondrej.SignUp.persistence.repository.SignComponentRepository;
import com.brodeckyondrej.SignUp.persistence.repository.SignRepository;
import com.brodeckyondrej.SignUp.persistence.repository.SignSearchRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class SignService extends EntityService<Sign, CreateSignDto, UpdateSignDto, SignGetDetailDto, SignGetListDto> {

    private final SignRepository signRepository;
    private final SignSearchRepository signSearchRepository;
    private final SignMapper signMapper;
    private final PrivateCollectionRepository collectionRepository;
    private final CategoryRepository categoryRepository;
    private final SignComponentRepository signComponentRepository;
    private final FileSystemVideoStorage fileSystemVideoStorage;

    public SignService(SignRepository repository, SignSearchRepository signSearchRepository,
                       SignValidator validator, SignMapper mapper,
                       PrivateCollectionRepository collectionRepository, CategoryRepository categoryRepository,
                       SignComponentRepository signComponentRepository, FileSystemVideoStorage fileSystemVideoStorage) {
        super(repository, validator, mapper);
        this.signRepository = repository;
        this.signSearchRepository = signSearchRepository;
        this.signMapper = mapper;
        this.collectionRepository = collectionRepository;
        this.categoryRepository = categoryRepository;
        this.signComponentRepository = signComponentRepository;
        this.fileSystemVideoStorage = fileSystemVideoStorage;
    }

    public Page<SignGetListDto> getByCategoryId(UUID categoryId, Pageable pageable){
        Category category = categoryRepository.findByIdOrThrow(categoryId);
        return signRepository.findByCategory(category, pageable)
                .map(signMapper::toDetailDto);
    }

    public Page<SignGetListDto> getByPrivateCollectionId(UUID privateCollectionId, Pageable pageable){
        PrivateCollection collection = collectionRepository.findByIdOrThrow(privateCollectionId);
        return signRepository.findDistinctByInPrivateCollectionsContains(collection, pageable)
                .map(signMapper::toDetailDto);
    }

    @Override
    public void delete(UUID id){
        Optional<Sign> sign = signRepository.findById(id);
        if(sign.isEmpty()){
            return;
        }

        //This is owned side of many to many relationship. it is necessary to delete relationships
        sign.get().getInPrivateCollections()
                        .forEach(privateCollection -> privateCollection.removeSign(sign.get()));

        fileSystemVideoStorage.delete(sign.get().getVideoFileName());
        super.delete(id);
    }

    /**
     * Advanced search with multiple criteria support using optimized database queries
     */
    public Page<SignGetListDto> advancedSearch(String query, UUID categoryId, SignType signType,
                                               LanguageLevel languageLevel, Region region,
                                               UUID handShapeId, UUID locationId, UUID movementId,
                                               UUID palmOrientationId, UUID fingerOrientationId,
                                               UUID contactRegionId, UUID handArrangementId,
                                               Pageable pageable) {

        // Use optimized database query instead of in-memory filtering
        Page<Sign> signs = signSearchRepository.findByMultipleCriteria(
            categoryId, signType, languageLevel, region,
            handShapeId, locationId, movementId, palmOrientationId,
            fingerOrientationId, contactRegionId, handArrangementId,
            pageable
        );

        // If text query is provided, filter further
        if (query != null && !query.trim().isEmpty()) {
            List<Sign> textFilteredSigns = signs.getContent().stream()
                .filter(sign -> matchesTextQuery(sign, query))
                .collect(Collectors.toList());

            return createPageFromList(textFilteredSigns, pageable);
        }

        return signs.map(signMapper::toDetailDto);
    }

    /**
     * Quick text search across translations and explanations using optimized database query
     */
    public Page<SignGetListDto> quickTextSearch(String query, Pageable pageable) {
        if (query == null || query.trim().isEmpty()) {
            return Page.empty(pageable);
        }

        // Use optimized database query with full-text search
        Page<Sign> signs = signSearchRepository.findByTranslationText(query.trim(), pageable);
        return signs.map(signMapper::toDetailDto);
    }

    /**
     * Find signs with similar movement patterns using optimized database query
     */
    public Page<SignGetListDto> findSignsWithSimilarMovement(UUID signId, Pageable pageable) {
        Optional<Sign> targetSign = signRepository.findById(signId);
        if (targetSign.isEmpty()) {
            return Page.empty(pageable);
        }

        Sign target = targetSign.get();

        // Use optimized database query for similarity search
        Page<Sign> similarSigns = signSearchRepository.findSimilarSigns(
            signId,
            target.getMovementComponent(),
            target.getHandShape(),
            target.getLocation(),
            target.getPalmOrientation(),
            target.getFingerOrientation(),
            pageable
        );

        return similarSigns.map(signMapper::toDetailDto);
    }

    /**
     * Get search suggestions based on partial query using optimized database query
     */
    public List<String> getSearchSuggestions(String query) {
        if (query == null || query.trim().length() < 2) {
            return Collections.emptyList();
        }

        // Use optimized database query for suggestions
        return signSearchRepository.findTranslationSuggestions(query.trim());
    }

    // Helper methods
    private boolean matchesTextQuery(Sign sign, String query) {
        if (query == null || query.trim().isEmpty()) {
            return true;
        }

        String lowerQuery = query.toLowerCase();

        // Check translations
        if (sign.getTranslations() != null) {
            boolean translationMatch = sign.getTranslations().stream()
                .anyMatch(translation -> translation.toLowerCase().contains(lowerQuery));
            if (translationMatch) return true;
        }

        // Check explanation
        if (sign.getExplanation() != null &&
            sign.getExplanation().toLowerCase().contains(lowerQuery)) {
            return true;
        }

        return false;
    }

    private boolean matchesCategory(Sign sign, UUID categoryId) {
        if (categoryId == null) return true;
        return sign.getCategory() != null && sign.getCategory().getId().equals(categoryId);
    }

    private boolean matchesSignType(Sign sign, SignType signType) {
        if (signType == null) return true;
        return sign.getType() == signType;
    }

    private boolean matchesLanguageLevel(Sign sign, LanguageLevel languageLevel) {
        if (languageLevel == null) return true;
        return sign.getLanguageLevel() == languageLevel;
    }

    private boolean matchesRegion(Sign sign, Region region) {
        if (region == null) return true;
        return sign.getRegion() == region;
    }

    private boolean matchesComponent(SignComponent component, UUID componentId) {
        if (componentId == null) return true;
        return component != null && component.getId().equals(componentId);
    }

    private boolean hasSimilarMovement(Sign sign1, Sign sign2) {
        // Check if signs have similar movement components
        int similarityCount = 0;

        if (isSameComponent(sign1.getMovementComponent(), sign2.getMovementComponent())) {
            similarityCount += 3; // Movement is most important
        }

        if (isSameComponent(sign1.getHandShape(), sign2.getHandShape())) {
            similarityCount += 2;
        }

        if (isSameComponent(sign1.getLocation(), sign2.getLocation())) {
            similarityCount += 2;
        }

        if (isSameComponent(sign1.getPalmOrientation(), sign2.getPalmOrientation())) {
            similarityCount += 1;
        }

        if (isSameComponent(sign1.getFingerOrientation(), sign2.getFingerOrientation())) {
            similarityCount += 1;
        }

        // Consider similar if at least 3 points of similarity
        return similarityCount >= 3;
    }

    private boolean isSameComponent(SignComponent comp1, SignComponent comp2) {
        if (comp1 == null && comp2 == null) return true;
        if (comp1 == null || comp2 == null) return false;
        return comp1.getId().equals(comp2.getId());
    }

    private Page<SignGetListDto> createPageFromList(List<Sign> signs, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), signs.size());

        if (start > signs.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, signs.size());
        }

        List<Sign> pageContent = signs.subList(start, end);
        List<SignGetListDto> dtoContent = pageContent.stream()
            .map(signMapper::toDetailDto)
            .collect(Collectors.toList());

        return new PageImpl<>(dtoContent, pageable, signs.size());
    }
}
