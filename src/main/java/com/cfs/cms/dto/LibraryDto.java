package com.cfs.cms.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class LibraryDto {
    private Long bookId;
    private String name;
    private String author;
    private String isbn;
    private LocalDate issueDate;
    private LocalDate returnDate;
    private Double fine;
}