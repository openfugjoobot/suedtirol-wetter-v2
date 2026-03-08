/**
 * Geolocation hook - Reactive geolocation for Svelte 5
 */

import { $state, $effect } from 'svelte/store';
import type { Coordinates } from '$lib/types/location.types';

export interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
  permission: 'granted' | 'denied' | 'prompt';
}

export interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

const DEFAULT_OPTIONS: UseGeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes
  watch: false
};

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  const state: GeolocationState = $state({
    coordinates: null,
    loading: false,
    error: null,
    permission: 'prompt'
  });

  /**
   * Request current position
   */
  async function getCurrentPosition() {
    if (!navigator.geolocation) {
      state.error = 'Geolocation not supported by browser';
      state.permission = 'denied';
      return;
    }

    state.loading = true;
    state.error = null;

    try {
      // Check permission first
      if ('permissions' in navigator) {
        try {
          const permissionStatus = await navigator.permissions.query({
            name: 'geolocation' as PermissionName
          });
          state.permission = permissionStatus.state as GeolocationState['permission'];
        } catch {
          // Permission API not supported
          state.permission = 'prompt';
        }
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: opts.enableHighAccuracy,
          timeout: opts.timeout,
          maximumAge: opts.maximumAge
        });
      });

      state.coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      state.permission = 'granted';
    } catch (error) {
      state.coordinates = null;
      state.error = getGeolocationErrorMessage(error as GeolocationPositionError);
      state.permission = 'denied';
    } finally {
      state.loading = false;
    }
  }

  /**
   * Watch position changes
   */
  function watchPosition() {
    if (!navigator.geolocation) {
      state.error = 'Geolocation not supported by browser';
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        state.coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        state.loading = false;
        state.error = null;
      },
      (error) => {
        state.coordinates = null;
        state.error = getGeolocationErrorMessage(error);
        state.loading = false;
      },
      {
        enableHighAccuracy: opts.enableHighAccuracy,
        timeout: opts.timeout,
        maximumAge: opts.maximumAge
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }

  /**
   * Clear current state
   */
  function clear() {
    state.coordinates = null;
    state.loading = false;
    state.error = null;
  }

  // Auto-fetch on mount if watch mode
  $effect(() => {
    if (opts.watch) {
      const cleanup = watchPosition();
      return cleanup;
    } else {
      getCurrentPosition();
    }
  });

  return {
    get coordinates() {
      return state.coordinates;
    },
    get loading() {
      return state.loading;
    },
    get error() {
      return state.error;
    },
    get permission() {
      return state.permission;
    },
    refresh: getCurrentPosition,
    clear
  };
}

/**
 * Convert geolocation error code to human-readable message
 */
function getGeolocationErrorMessage(error: GeolocationPositionError): string {
  const errorMessages: Record<number, string> = {
    1: 'Location permission denied',
    2: 'Location information unavailable',
    3: 'Location request timed out'
  };

  return errorMessages[error.code] || 'An unknown error occurred';
}
