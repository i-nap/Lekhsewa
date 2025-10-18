package com.lekhsewa.backend.repository;

import com.lekhsewa.backend.model.Form;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FormRepository extends JpaRepository<Form, Long> {

    @Query("select f from Form f where lower(f.name) like lower(concat('%', :q, '%'))")
    Page<Form> searchByNameContains(@Param("q") String q, Pageable pageable);

    @Query("select f from Form f where lower(f.name) like lower(concat(:q, '%'))")
    Page<Form> suggestByNamePrefix(@Param("q") String q, Pageable pageable);

    Optional<Form> findGraphById(@Param("id") Long id);
}
