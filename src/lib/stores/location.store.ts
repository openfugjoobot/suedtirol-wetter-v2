import { writable, type Writable } from 'svelte/store';
import type { Coordinates } from '$lib/types/weather.types';

interface LocationState {
  current: Coordinates | null;
  favorites: Coordinates[];
  recent: Coordinates[];
  useGeolocation: boolean;
  loading: boolean;
  error: string | null;
}

function createLocationStore() {
  const initialStore: LocationState = {
    current: null,
    favorites: [],
    recent: [],
    useGeolocation: true,
    loading: false,
    error: null
  };
  
  const { subscribe, update, set } = writable<LocationState>(initialStore);
  
  return {
    subscribe,
    
    setCurrentLocation(coords: Coordinates) {
      update((state) => ({
        ...state,
        current: coords,
        recent: [coords, ...state.recent.filter(c => 
          Math.abs(c.latitude - coords.latitude) > 0.01 ||
          Math.abs(c.longitude - coords.longitude) > 0.01
        )].slice(0, 10)
      }));
    },
    
    addFavorite(coords: Coordinates) {
      update((state) => ({
        ...state,
        favorites: [
          coords,
          ...state.favorites.filter(c => 
            Math.abs(c.latitude - coords.latitude) > 0.01 ||
            Math.abs(c.longitude - coords.longitude) > 0.01
          )
        ]
      }));
    },
    
    removeFavorite(coords: Coordinates) {
      update((state) => ({
        ...state,
        favorites: state.favorites.filter(c => 
          Math.abs(c.latitude - coords.latitude) > 0.01 ||
          Math.abs(c.longitude - coords.longitude) > 0.01
        )
      }));
    },
    
    toggleUseGeolocation(useGeo: boolean) {
      update((state) => ({
        ...state,
        useGeolocation: useGeo
      }));
    },
    
    loadFromStorage() {
      try {
        const saved = localStorage.getItem('suedtirol-wetter-locations');
        if (saved) {
          const data = JSON.parse(saved);
          set({
            current: data.current,
            favorites: data.favorites || [],
            recent: data.recent || [],
            useGeolocation: data.useGeolocation ?? true,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Failed to load location data from storage:', error);
      }
    },
    
    saveToStorage() {
      update((state) => {
        const data = {
          current: state.current,
          favorites: state.favorites,
          recent: state.recent,
          useGeolocation: state.useGeolocation
        };
        
        localStorage.setItem('suedtirol-wetter-locations', JSON.stringify(data));
        
        return state;
      });
    }
  };
}

export const locationStore = createLocationStore();
