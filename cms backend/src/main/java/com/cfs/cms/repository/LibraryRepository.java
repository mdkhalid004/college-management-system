package com.cfs.cms.repository;

import com.cfs.cms.entity.Library;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LibraryRepository extends JpaRepository<Library, Long> {
    List<Library> findByNameContainingIgnoreCaseOrAuthorContainingIgnoreCaseOrIsbnContainingIgnoreCase(String name, String author, String isbn);
}