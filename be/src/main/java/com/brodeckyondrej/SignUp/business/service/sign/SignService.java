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
    private final SignMapper signMapper;
    private final PrivateCollectionRepository collectionRepository;
    private final CategoryRepository categoryRepository;
    private final FileSystemVideoStorage fileSystemVideoStorage;

    public SignService(SignRepository repository, SignValidator validator, SignMapper mapper,
                       PrivateCollectionRepository collectionRepository, CategoryRepository categoryRepository,
                       FileSystemVideoStorage fileSystemVideoStorage) {
        super(repository, validator, mapper);
        this.signRepository = repository;
        this.signMapper = mapper;
        this.collectionRepository = collectionRepository;
        this.categoryRepository = categoryRepository;
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
}
