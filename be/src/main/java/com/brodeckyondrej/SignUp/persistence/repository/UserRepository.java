package com.brodeckyondrej.SignUp.persistence.repository;

import com.brodeckyondrej.SignUp.persistence.entity.Classroom;
import com.brodeckyondrej.SignUp.persistence.entity.Subject;
import com.brodeckyondrej.SignUp.persistence.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface UserRepository extends NamedEntityRepository<User> {
    Page<User> findByClassroom(Classroom classroom, Pageable pageable);
    Page<User> findDistinctBySubjectsContaining(Subject subject, Pageable pageable);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
