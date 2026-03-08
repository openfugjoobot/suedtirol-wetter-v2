/**
 * Unit tests for PreferencesService
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { PreferencesService } from '../../src/lib/services/preferences.service';

// Mock localStorage
const localStorageMock = {
  store: new Map<string, string>(),
  getItem: vi.fn((key: string) => this.store.get(key) || null),
  setItem: vi.fn((key: string, value: string) => { this.store.set(key, value); }),
  removeItem: vi.fn((key: string) => { this.store.delete(key); }),
  clear: vi.fn(() => { this.store.clear(); })
};

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
});

describe('PreferencesService', () => {
  let service: PreferencesService;

  beforeEach(() => {
    localStorageMock.store.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  beforeEach(() => {
    service = new PreferencesService();
  });

  describe('getPreferences', () => {
    it('should return default preferences when no storage exists', () => {
      const prefs = service.getPreferences();

      expect(prefs).toBeDefined();
      expect(prefs.language).toBe('de');
      expect(prefs.temperatureUnit).toBe('celsius');
      expect(prefs.windSpeedUnit).toBe('kmh');
      expect(prefs.theme).toBe('system');
      expect(prefs.notifications.severeWeather).toBe(true);
      expect(prefs.locations.useGeolocation).toBe(true);
    });

    it('should return stored preferences when available', () => {
      const customPrefs = {
        language: 'it',
        temperatureUnit: 'fahrenheit',
        theme: 'dark',
        notifications: {
          severeWeather: false,
          severeWeatherLevel: 'high' as const,
          dailyForecast: true
        }
      };

      localStorageMock.store.set(
        'suedtirol-wetter-preferences',
        JSON.stringify(customPrefs)
      );

      const prefs = service.getPreferences();

      expect(prefs.language).toBe('it');
      expect(prefs.temperatureUnit).toBe('fahrenheit');
      expect(prefs.theme).toBe('dark');
      expect(prefs.notifications.severeWeather).toBe(false);
    });

    it('should merge stored preferences with defaults', () => {
      const partialPrefs = {
        language: 'en',
        theme: 'light'
      };

      localStorageMock.store.set(
        'suedtirol-wetter-preferences',
        JSON.stringify(partialPrefs)
      );

      const prefs = service.getPreferences();

      expect(prefs.language).toBe('en');
      expect(prefs.theme).toBe('light');
      // Should have defaults for missing properties
      expect(prefs.temperatureUnit).toBe('celsius');
      expect(prefs.windSpeedUnit).toBe('kmh');
      expect(prefs.notifications.severeWeather).toBe(true);
    });

    it('should return defaults when storage is corrupted', () => {
      localStorageMock.store.set(
        'suedtirol-wetter-preferences',
        'invalid-json{'
      );

      const prefs = service.getPreferences();

      expect(prefs.language).toBe('de');
      expect(prefs.temperatureUnit).toBe('celsius');
    });

    it('should parse stored dates correctly', () => {
      const storedDate = new Date('2026-03-08T12:00:00Z').toISOString();
      const prefs = {
        language: 'de',
        lastUpdated: storedDate
      };

      localStorageMock.store.set(
        'suedtirol-wetter-preferences',
        JSON.stringify(prefs)
      );

      const result = service.getPreferences();
      expect(result.lastUpdated).toBeInstanceOf(Date);
    });
  });

  describe('savePreferences', () => {
    it('should save preferences to localStorage', () => {
      const prefs = {
        language: 'it',
        temperatureUnit: 'celsius',
        windSpeedUnit: 'kmh',
        pressureUnit: 'hPa',
        timeFormat: '24h',
        theme: 'dark' as const,
        notifications: {
          severeWeather: true,
          severeWeatherLevel: 'moderate' as const,
          dailyForecast: false
        },
        locations: {
          favorites: [],
          recent: [],
          defaultLocation: 'current' as const,
          useGeolocation: true
        },
        lastUpdated: new Date()
      };

      service.savePreferences(prefs);

      expect(localStorageMock.setItem).toHaveBeenCalled();
      expect(localStorageMock.store.has('suedtirol-wetter-preferences')).toBe(true);
    });

    it('should update lastUpdated timestamp when saving', () => {
      const prefs = service.getPreferences();
      const beforeSave = new Date();

      service.savePreferences(prefs);

      const saved = JSON.parse(localStorageMock.store.get('suedtirol-wetter-preferences')!);
      expect(new Date(saved.lastUpdated).getTime()).toBeGreaterThanOrEqual(beforeSave.getTime());
    });

    it('should handle save errors gracefully', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage full');
      });

      const prefs = service.getPreferences();

      // Should not throw
      expect(() => service.savePreferences(prefs)).not.toThrow();
    });
  });

  describe('updatePreferences', () => {
    it('should update specific fields', () => {
      const updated = service.updatePreferences({
        language: 'en',
        theme: 'light'
      });

      expect(updated.language).toBe('en');
      expect(updated.theme).toBe('light');
      // Other fields should remain default
      expect(updated.temperatureUnit).toBe('celsius');
    });

    it('should persist updates to storage', () => {
      service.updatePreferences({ language: 'it' });

      const stored = JSON.parse(localStorageMock.store.get('suedtirol-wetter-preferences')!);
      expect(stored.language).toBe('it');
    });

    it('should update lastUpdated timestamp', () => {
      const beforeUpdate = new Date();

      service.updatePreferences({ theme: 'dark' });

      const stored = JSON.parse(localStorageMock.store.get('suedtirol-wetter-preferences')!);
      expect(new Date(stored.lastUpdated).getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });

    it('should return updated preferences', () => {
      const result = service.updatePreferences({ 
        notifications: { 
          severeWeather: false,
          severeWeatherLevel: 'high',
          dailyForecast: true
        }
      });

      expect(result.notifications.severeWeather).toBe(false);
      expect(result.notifications.dailyForecast).toBe(true);
    });
  });

  describe('resetPreferences', () => {
    it('should reset to default values', () => {
      service.updatePreferences({ language: 'it', theme: 'dark' });

      const reset = service.resetPreferences();

      expect(reset.language).toBe('de');
      expect(reset.theme).toBe('system');
      expect(reset.notifications.severeWeather).toBe(true);
    });

    it('should persist reset to storage', () => {
      service.updatePreferences({ language: 'en' });
      service.resetPreferences();

      const stored = JSON.parse(localStorageMock.store.get('suedtirol-wetter-preferences')!);
      expect(stored.language).toBe('de');
    });
  });

  describe('addFavoriteLocation', () => {
    it('should add location to favorites', () => {
      service.addFavoriteLocation('bozen');

      const prefs = service.getPreferences();
      expect(prefs.locations.favorites).toContain('bozen');
    });

    it('should not add duplicate favorites', () => {
      service.addFavoriteLocation('bozen');
      service.addFavoriteLocation('bozen');

      const prefs = service.getPreferences();
      expect(prefs.locations.favorites.filter(id => id === 'bozen').length).toBe(1);
    });

    it('should persist to storage', () => {
      service.addFavoriteLocation('meran');

      const stored = JSON.parse(localStorageMock.store.get('suedtirol-wetter-preferences')!);
      expect(stored.locations.favorites).toContain('meran');
    });
  });

  describe('removeFavoriteLocation', () => {
    it('should remove location from favorites', () => {
      service.addFavoriteLocation('bozen');
      service.addFavoriteLocation('meran');

      service.removeFavoriteLocation('bozen');

      const prefs = service.getPreferences();
      expect(prefs.locations.favorites).not.toContain('bozen');
      expect(prefs.locations.favorites).toContain('meran');
    });

    it('should handle removing non-existent location', () => {
      service.addFavoriteLocation('bozen');

      // Should not throw
      expect(() => service.removeFavoriteLocation('nonexistent')).not.toThrow();

      const prefs = service.getPreferences();
      expect(prefs.locations.favorites).toContain('bozen');
    });
  });

  describe('addRecentLocation', () => {
    it('should add location to recent', () => {
      service.addRecentLocation('brixen');

      const prefs = service.getPreferences();
      expect(prefs.locations.recent).toContain('brixen');
    });

    it('should move existing location to front', () => {
      service.addRecentLocation('bozen');
      service.addRecentLocation('meran');
      service.addRecentLocation('bozen');

      const prefs = service.getPreferences();
      expect(prefs.locations.recent[0]).toBe('bozen');
      expect(prefs.locations.recent.indexOf('bozen')).toBe(0);
    });

    it('should limit to 10 recent locations', () => {
      for (let i = 0; i < 15; i++) {
        service.addRecentLocation(`location-${i}`);
      }

      const prefs = service.getPreferences();
      expect(prefs.locations.recent.length).toBe(10);
    });
  });

  describe('setDefaultLocation', () => {
    it('should set default location ID', () => {
      service.setDefaultLocation('bozen');

      const prefs = service.getPreferences();
      expect(prefs.locations.defaultLocation).toBe('bozen');
    });

    it('should set to current location', () => {
      service.setDefaultLocation('current');

      const prefs = service.getPreferences();
      expect(prefs.locations.defaultLocation).toBe('current');
    });
  });

  describe('setUseGeolocation', () => {
    it('should enable geolocation', () => {
      service.setUseGeolocation(true);

      const prefs = service.getPreferences();
      expect(prefs.locations.useGeolocation).toBe(true);
    });

    it('should disable geolocation', () => {
      service.setUseGeolocation(false);

      const prefs = service.getPreferences();
      expect(prefs.locations.useGeolocation).toBe(false);
    });
  });
});
