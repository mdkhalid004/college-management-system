package com.cfs.cms.serviceImpl;

import com.cfs.cms.dto.LibraryDto;
import com.cfs.cms.entity.Library;
import com.cfs.cms.repository.LibraryRepository;
import com.cfs.cms.service.LibraryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LibraryServiceImpl implements LibraryService {

    private final LibraryRepository libraryRepository;

    @Override
    public LibraryDto createLibraryRecord(LibraryDto libraryDto) {
        Library library = new Library();
        library.setName(libraryDto.getName());
        library.setAuthor(libraryDto.getAuthor());
        library.setIsbn(libraryDto.getIsbn());
        library.setIssueDate(libraryDto.getIssueDate());
        library.setReturnDate(libraryDto.getReturnDate());
        library.setFine(libraryDto.getFine() != null ? libraryDto.getFine() : 0.0);

        Library savedLibrary = libraryRepository.save(library);
        return mapToDto(savedLibrary);
    }

    @Override
    public List<LibraryDto> getAllLibraryRecords() {
        return libraryRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public LibraryDto getLibraryRecordById(Long bookId) {
        Library library = libraryRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Library record not found"));
        return mapToDto(library);
    }

    @Override
    public LibraryDto updateLibraryRecord(Long bookId, LibraryDto libraryDto) {
        Library library = libraryRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Library record not found"));

        library.setName(libraryDto.getName());
        library.setAuthor(libraryDto.getAuthor());
        library.setIsbn(libraryDto.getIsbn());
        library.setIssueDate(libraryDto.getIssueDate());
        library.setReturnDate(libraryDto.getReturnDate());
        library.setFine(libraryDto.getFine() != null ? libraryDto.getFine() : 0.0);

        Library updatedLibrary = libraryRepository.save(library);
        return mapToDto(updatedLibrary);
    }

    @Override
    public void deleteLibraryRecord(Long bookId) {
        libraryRepository.deleteById(bookId);
    }

    private LibraryDto mapToDto(Library library) {
        LibraryDto dto = new LibraryDto();
        dto.setBookId(library.getBookId());
        dto.setName(library.getName());
        dto.setAuthor(library.getAuthor());
        dto.setIsbn(library.getIsbn());
        dto.setIssueDate(library.getIssueDate());
        dto.setReturnDate(library.getReturnDate());
        dto.setFine(library.getFine());
        return dto;
    }
}