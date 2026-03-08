/**
 * Preferences service - Manages user preferences
 */

import type { UserPreferences } from '../types/preferences.types';

export class PreferencesService {
  private static readonly STORAGE_KEY = 'suedtirol-wetter-preferences';
  private static readonly DEFAULT_PREFERENCES: UserPreferences = {
    language: 'de',
    temperatureUnit: 'celsius',
    windSpeedUnit: 'kmh',
    pressureUnit: 'hPa',
    timeFormat: '24h',
    theme: 'system',
    notifications: {
      severeWeather: true,
      severeWeatherLevel: 'moderate',
      dailyForecast: false
    },
    locations: {
      favorites: [],
      recent: [],
      defaultLocation: 'current',
      useGeolocation: true
    },
    lastUpdated: new Date()
  };

  /**
   * Get user preferences from localStorage or return defaults
   */
  getPreferences(): UserPreferences {
    try {
      const stored = localStorage.getItem(PreferencesService.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all properties exist
        return {
          ...PreferencesService.DEFAULT_PREFERENCES,
          ...parsed,
          lastUpdated: parsed.lastUpdated ? new Date(parsed.lastUpdated) : new Date()
        };
      }
    } catch (error) {
      console.warn('Failed to parse preferences, using defaults:', error);
    }

    return { ...PreferencesService.DEFAULT_PREFERENCES };
  }

  /**
   * Save user preferences to localStorage
   */
  savePreferences(preferences: UserPreferences): void {
    try {
      const toSave = {
        ...preferences,
        lastUpdated: new Date()
      };
      localStorage.setItem(PreferencesService.STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  /**
   * Update specific preference fields
   */
  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...updates, lastUpdated: new Date() };
    this.savePreferences(updated);
    return updated;
  }

  /**
   * Reset preferences to defaults
   */
  resetPreferences(): UserPreferences {
    const defaults = { ...PreferencesService.DEFAULT_PREFERENCES };
    this.savePreferences(defaults);
    return defaults;
  }

  /**
   * Add a location to favorites
   */
  addFavoriteLocation(locationId: string): void {
    const prefs = this.getPreferences();
    if (!prefs.locations.favorites.includes(locationId)) {
      prefs.locations.favorites.push(locationId);
      this.savePreferences(prefs);
    }
  }

  /**
   * Remove a location from favorites
   */
  removeFavoriteLocation(locationId: string): void {
    const prefs = this.getPreferences();
    prefs.locations.favorites = prefs.locations.favorites.filter(id => id !== locationId);
    this.savePreferences(prefs);
  }

  /**
   * Add a location to recent views
   */
  addRecentLocation(locationId: string): void {
    const prefs = this.getPreferences();
    // Remove if already exists
    prefs.locations.recent = prefs.locations.recent.filter(id => id !== locationId);
    // Add to beginning of array
    prefs.locations.recent.unshift(locationId);
    // Limit to 10 recent locations
    prefs.locations.recent = prefs.locations.recent.slice(0, 10);
    this.savePreferences(prefs);
  }

  /**
   * Set default location
   */
  setDefaultLocation(locationId: string | 'current'): void {
    const prefs = this.getPreferences();
    prefs.locations.defaultLocation = locationId;
    this.savePreferences(prefs);
  }

  /**
   * Enable/disable geolocation
   */
  setUseGeolocation(use: boolean): void {
    const prefs = this.getPreferences();
    prefs.locations.useGeolocation = use;
    this.savePreferences(prefs);
  }
}