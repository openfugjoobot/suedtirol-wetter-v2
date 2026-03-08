/**
 * Global application state store using Svelte 5 runes
 */

import { PreferencesService } from '../services/preferences.service';
import { LocationService } from '../services/weather.service';
import type { UserPreferences } from '../types/preferences.types';
import type { Location, Coordinates } from '../types/location.types';

// Create service instances
const preferencesService = new PreferencesService();
const locationService = new LocationService();

// Application state interface
export interface AppState {
  preferences: UserPreferences;
  currentLocation: Location | null;
  selectedLocation: Location | null;
  isLoadingLocation: boolean;
  locationError: string | null;
  isOnline: boolean;
  lastUpdated: Date | null;
}

// Initialize state
let initialState: AppState = {
  preferences: preferencesService.getPreferences(),
  currentLocation: null,
  selectedLocation: null,
  isLoadingLocation: false,
  locationError: null,
  isOnline: navigator.onLine,
  lastUpdated: null
};

// Create reactive state using Svelte 5 runes
export class AppStore {
  private state = $state(initialState);
  
  // Readable properties
  get preferences() { return this.state.preferences; }
  get currentLocation() { return this.state.currentLocation; }
  get selectedLocation() { return this.state.selectedLocation; }
  get isLoadingLocation() { return this.state.isLoadingLocation; }
  get locationError() { return this.state.locationError; }
  get isOnline() { return this.state.isOnline; }
  get lastUpdated() { return this.state.lastUpdated; }
  
  // Methods to update state
  
  updatePreferences(updates: Partial<UserPreferences>) {
    this.state.preferences = preferencesService.updatePreferences(updates);
  }
  
  async loadCurrentLocation() {
    this.state.isLoadingLocation = true;
    this.state.locationError = null;
    
    try {
      const result = await locationService.getCurrentLocation();
      
      if (result.success && result.coordinates) {
        // Try to get detailed location info
        const location = await locationService.reverseGeocode(result.coordinates);
        
        if (location) {
          this.state.currentLocation = location;
        } else {
          // Create a basic location object from coordinates
          this.state.currentLocation = {
            id: `current-${result.coordinates.latitude},${result.coordinates.longitude}`,
            name: { de: 'Aktueller Standort', it: 'Posizione attuale', en: 'Current Location', ld: 'Posiziun actuala' },
            coordinates: result.coordinates,
            elevation: 0,
            region: 'bolzano', // default
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          };
        }
        
        // If no location is selected, select current location
        if (!this.state.selectedLocation) {
          this.state.selectedLocation = this.state.currentLocation;
        }
      } else {
        this.state.locationError = this.getLocationErrorMessage(result.error);
      }
    } catch (error) {
      this.state.locationError = 'Fehler beim Abrufen des Standorts';
      console.error('Error getting current location:', error);
    } finally {
      this.state.isLoadingLocation = false;
      this.state.lastUpdated = new Date();
    }
  }
  
  selectLocation(location: Location) {
    this.state.selectedLocation = location;
    // Add to recent locations
    preferencesService.addRecentLocation(location.id);
  }
  
  addFavoriteLocation(locationId: string) {
    preferencesService.addFavoriteLocation(locationId);
    // Update preferences in state
    this.state.preferences = preferencesService.getPreferences();
  }
  
  removeFavoriteLocation(locationId: string) {
    preferencesService.removeFavoriteLocation(locationId);
    // Update preferences in state
    this.state.preferences = preferencesService.getPreferences();
  }
  
  updateOnlineStatus(isOnline: boolean) {
    this.state.isOnline = isOnline;
  }
  
  // Helper methods
  
  private getLocationErrorMessage(errorCode: string | undefined): string {
    switch (errorCode) {
      case 'PERMISSION_DENIED':
        return 'Standortberechtigung verweigert. Bitte in den Einstellungen aktivieren.';
      case 'POSITION_UNAVAILABLE':
        return 'Standort nicht verfügbar. Bitte GPS aktivieren.';
      case 'TIMEOUT':
        return 'Zeitüberschreitung bei der Standortabfrage.';
      case 'NOT_SUPPORTED':
        return 'Standortdienste werden von diesem Gerät nicht unterstützt.';
      default:
        return 'Fehler beim Abrufen des Standorts.';
    }
  }
}

// Export singleton instance
export const appStore = new AppStore();

// Initialize online status tracking
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    appStore.updateOnlineStatus(true);
  });
  
  window.addEventListener('offline', () => {
    appStore.updateOnlineStatus(false);
  });
}