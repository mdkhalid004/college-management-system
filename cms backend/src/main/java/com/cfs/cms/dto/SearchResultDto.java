package com.cfs.cms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDto {
    private String category;    // e.g., "Student", "Course", "Page"
    private String title;       // e.g., "Rahul Sharma" or "Fees Module"
    private String subtitle;    // e.g., "Student ID: 105" or "Go to Fees"
    private String redirectUrl; // e.g., "/students" or "/fees"
}