package com.cfs.cms.serviceImpl;



import com.cfs.cms.entity.Settings;
import com.cfs.cms.repository.SettingsRepository;
import com.cfs.cms.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SettingsServiceImpl implements SettingsService {

    @Autowired
    private SettingsRepository settingsRepository;

    @Override
    public Settings getSettings() {
        return settingsRepository.findAll().stream().findFirst().orElseGet(() -> {
            Settings defaultSettings = new Settings();
            defaultSettings.setDarkMode(false);
            defaultSettings.setAcademicYear("2026-2027");
            return settingsRepository.save(defaultSettings);
        });
    }

    @Override
    public Settings updateSettings(Settings newSettingsData) {
        Settings settings = getSettings();
        settings.setDarkMode(newSettingsData.isDarkMode());
        settings.setAcademicYear(newSettingsData.getAcademicYear());
        return settingsRepository.save(settings);
    }
}
