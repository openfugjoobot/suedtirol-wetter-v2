/**
 * Location service - Handles location management and geocoding
 */

import type { Location, Coordinates, GeolocationResult } from '../types/location.types';
import type { OpenMeteoGeocodingResponse } from '../types/api.types';
import { OpenMeteoClient } from '../api/open-meteo.client';

export class LocationService {
  private client: OpenMeteoClient;
  private staticLocations: Location[];

  constructor() {
    this.client = new OpenMeteoClient();
    this.staticLocations = this.getSouthTyrolLocations();
  }

  /**
   * Get user's current location using browser geolocation API
   */
  async getCurrentLocation(): Promise<GeolocationResult> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({
          success: false,
          error: 'NOT_SUPPORTED'
        });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: Coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };

          resolve({
            success: true,
            coordinates: coords
          });
        },
        (error) => {
          let errorCode: GeolocationResult['error'] = 'POSITION_UNAVAILABLE';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorCode = 'PERMISSION_DENIED';
              break;
            case error.TIMEOUT:
              errorCode = 'TIMEOUT';
              break;
          }

          resolve({
            success: false,
            error: errorCode
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  /**
   * Search for locations by name
   */
  async searchLocations(query: string): Promise<Location[]> {
    // First search in our static South Tyrol locations
    const staticMatches = this.searchStaticLocations(query);
    
    // If we have enough matches, return them
    if (staticMatches.length >= 5) {
      return staticMatches.slice(0, 10);
    }

    // Otherwise, search with Open-Meteo geocoding API
    try {
      const response = await this.client.searchLocations(query, {
        count: 10,
        language: 'de'
      });

      const apiMatches = this.transformGeocodingResults(response);
      return [...staticMatches, ...apiMatches].slice(0, 10);
    } catch (error) {
      // If API fails, return static matches only
      return staticMatches;
    }
  }

  /**
   * Reverse geocode coordinates to find nearby locations
   */
  async reverseGeocode(coords: Coordinates): Promise<Location | null> {
    // First check if we have a known South Tyrol location nearby
    const nearbyStatic = this.findNearbyStaticLocation(coords);
    if (nearbyStatic) {
      return nearbyStatic;
    }

    // Otherwise, use Open-Meteo reverse geocoding
    try {
      const response = await this.client.reverseGeocode(coords, {
        language: 'de'
      });

      if (response.results && response.results.length > 0) {
        return this.transformGeocodingResult(response.results[0]);
      }
    } catch (error) {
      // If API fails, return null
    }

    return null;
  }

  /**
   * Search for locations in our static South Tyrol database
   */
  private searchStaticLocations(query: string): Location[] {
    const normalizedQuery = query.toLowerCase().trim();
    
    return this.staticLocations.filter(location => {
      return (
        location.name.de.toLowerCase().includes(normalizedQuery) ||
        location.name.it?.toLowerCase().includes(normalizedQuery) ||
        location.name.en?.toLowerCase().includes(normalizedQuery) ||
        location.id.toLowerCase().includes(normalizedQuery)
      );
    });
  }

  /**
   * Find a nearby static location within a reasonable distance
   */
  private findNearbyStaticLocation(coords: Coordinates): Location | null {
    // Simple nearest neighbor search (would be more efficient with spatial indexing)
    let closestLocation: Location | null = null;
    let closestDistance = Number.MAX_VALUE;

    for (const location of this.staticLocations) {
      const distance = this.calculateDistance(
        coords,
        location.coordinates
      );

      // If within 20km, consider it a match
      if (distance < 20 && distance < closestDistance) {
        closestLocation = location;
        closestDistance = distance;
      }
    }

    return closestLocation;
  }

  /**
   * Transform Open-Meteo geocoding results to our location model
   */
  private transformGeocodingResults(response: OpenMeteoGeocodingResponse): Location[] {
    if (!response.results) {
      return [];
    }

    return response.results.map(result => this.transformGeocodingResult(result));
  }

  /**
   * Transform a single Open-Meteo geocoding result to our location model
   */
  private transformGeocodingResult(result: OpenMeteoGeocodingResponse['results'][0]): Location {
    return {
      id: `geo-${result.id}`,
      name: {
        de: result.name,
        it: result.name,
        en: result.name,
        ld: result.name
      },
      coordinates: {
        latitude: result.latitude,
        longitude: result.longitude
      },
      elevation: result.elevation,
      region: this.determineRegion(result.region, result.admin1),
      timezone: result.timezone,
      population: result.population
    };
  }

  /**
   * Determine South Tyrol region based on geocoding data
   */
  private determineRegion(region: string, admin1: string): Location['region'] {
    const regionMap: Record<string, Location['region']> = {
      'Bolzano': 'bolzano',
      'Meran': 'meran',
      'Brixen': 'eisacktal',
      'Bruneck': 'pustertal',
      'Vipiteno': 'vinschgau',
      'Sterzing': 'vinschgau',
      'Bozen': 'bolzano',
      'Merano': 'meran',
      'Bressanone': 'eisacktal',
      'Brunico': 'pustertal'
    };

    for (const [key, value] of Object.entries(regionMap)) {
      if (region.includes(key) || admin1.includes(key)) {
        return value;
      }
    }

    // Default to bolzano if we can't determine
    return 'bolzano';
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth radius in km
    const dLat = this.toRadians(coord2.latitude - coord1.latitude);
    const dLon = this.toRadians(coord2.longitude - coord1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coord1.latitude)) * 
      Math.cos(this.toRadians(coord2.latitude)) * 
      Math.sin(dLon / 2) * 
      Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get static list of South Tyrol locations
   */
  private getSouthTyrolLocations(): Location[] {
    return [
      {
        id: 'bozen',
        name: { de: 'Bozen', it: 'Bolzano', en: 'Bolzano', ld: 'Bulsan' },
        coordinates: { latitude: 46.4983, longitude: 11.3548 },
        elevation: 262,
        region: 'bolzano',
        timezone: 'Europe/Rome',
        population: 107436,
      },
      {
        id: 'meran',
        name: { de: 'Meran', it: 'Merano', en: 'Merano' },
        coordinates: { latitude: 46.6682, longitude: 11.1597 },
        elevation: 325,
        region: 'meran',
        timezone: 'Europe/Rome',
        population: 41546,
      },
      {
        id: 'brixen',
        name: { de: 'Brixen', it: 'Bressanone', en: 'Bressanone', ld: 'Presan' },
        coordinates: { latitude: 46.7124, longitude: 11.8553 },
        elevation: 494,
        region: 'eisacktal',
        timezone: 'Europe/Rome',
        population: 18664,
      },
      {
        id: 'bruneck',
        name: { de: 'Bruneck', it: 'Brunico', en: 'Brunico', ld: 'Prün' },
        coordinates: { latitude: 46.7962, longitude: 11.9266 },
        elevation: 597,
        region: 'pustertal',
        timezone: 'Europe/Rome',
        population: 15676,
      },
      {
        id: 'vipiteno',
        name: { de: 'Vipiteno', it: 'Sterzing', en: 'Sterzing', ld: 'Stërl' },
        coordinates: { latitude: 46.8947, longitude: 11.4315 },
        elevation: 927,
        region: 'vinschgau',
        timezone: 'Europe/Rome',
        population: 11151,
      },
      {
        id: 'schlanders',
        name: { de: 'Schlanders', it: 'Salorno', en: 'Salorno' },
        coordinates: { latitude: 46.5522, longitude: 11.1779 },
        elevation: 350,
        region: 'meran',
        timezone: 'Europe/Rome',
        population: 5200,
      },
      {
        id: 'klausen',
        name: { de: 'Klausen', it: 'Chiusa', en: 'Chiusa', ld: 'Clusa' },
        coordinates: { latitude: 46.6636, longitude: 11.5108 },
        elevation: 850,
        region: 'eisacktal',
        timezone: 'Europe/Rome',
        population: 5900,
      },
      // Additional locations could be added here
    ];
  }
}