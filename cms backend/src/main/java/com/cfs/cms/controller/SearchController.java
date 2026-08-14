package com.cfs.cms.controller;

import com.cfs.cms.dto.SearchResultDto;
import com.cfs.cms.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/search")
    public ResponseEntity<List<SearchResultDto>> searchAll(@RequestParam("query") String query) {

        List<SearchResultDto> results = searchService.globalSearch(query);

        return ResponseEntity.ok(results);
    }
}