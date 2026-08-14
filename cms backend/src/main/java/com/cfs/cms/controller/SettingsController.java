package com.cfs.cms.controller;



import com.cfs.cms.entity.Settings;
import com.cfs.cms.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:4200")
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @GetMapping
    public ResponseEntity<Settings> getSettings() {
        Settings settings = settingsService.getSettings();
        return ResponseEntity.ok(settings);
    }

    @PutMapping
    public ResponseEntity<Settings> updateSettings(@RequestBody Settings settingsData) {
        Settings updatedSettings = settingsService.updateSettings(settingsData);
        return ResponseEntity.ok(updatedSettings);
    }
}