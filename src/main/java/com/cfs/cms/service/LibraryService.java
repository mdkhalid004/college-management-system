package com.cfs.cms.service;

import com.cfs.cms.dto.LibraryDto;
import java.util.List;

public interface LibraryService {
    LibraryDto createLibraryRecord(LibraryDto libraryDto);
    List<LibraryDto> getAllLibraryRecords();
    LibraryDto getLibraryRecordById(Long bookId);
    LibraryDto updateLibraryRecord(Long bookId, LibraryDto libraryDto);
    void deleteLibraryRecord(Long bookId);
}