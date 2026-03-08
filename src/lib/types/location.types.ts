/** South Tyrol location with i18n support */
export interface Location {
  id: string;                 // Slug-based ID
  name: LocalizedString;      // Names in 4 languages
  coordinates: Coordinates;
  elevation: number;          // meters
  region: SouthTyrolRegion;
  timezone: string;
  population?: number;        // For sorting
  isFavorite?: boolean;
  lastAccessed?: Date;
}

export interface LocalizedString {
  de: string;                 // German
  it: string;                 // Italian
  en: string;                 // English
  ld?: string;                // Ladin (may be missing)
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** South Tyrol regions */
export type SouthTyrolRegion = 
  | 'bolzano'
  | 'meran'
  | 'bozen-uberetsch'
  | 'vinschgau'
  | 'eisacktal'
  | 'pustertal'
  | 'salten-schlern'
  | 'ubbental';

/** User location preference */
export interface UserLocation extends Location {
  isCurrent: boolean;        // Geolocation detected
  isFavorite: boolean;
  order: number;             // Display order
}

/** Geolocation result */
export interface GeolocationResult {
  success: boolean;
  coordinates?: Coordinates;
  error?: GeolocationError;
  location?: Location;       // Resolved location
}

export type GeolocationError = 
  | 'PERMISSION_DENIED'
  | 'POSITION_UNAVAILABLE'
  | 'TIMEOUT'
  | 'NOT_SUPPORTED';

// Location reference for weather data
export interface LocationReference {
  id: string;
  name: LocalizedString;
  coordinates: Coordinates;
}