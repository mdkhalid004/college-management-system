package com.cfs.cms.service;


import com.cfs.cms.entity.Settings;;

public interface SettingsService {
    Settings getSettings();
    Settings updateSettings(Settings newSettingsData);
}