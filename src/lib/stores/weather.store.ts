import { writable, type Writable } from 'svelte/store';
import type { CurrentWeather, HourlyForecast, DailyForecast } from '$lib/types/weather.types';

interface WeatherState {
  current: CurrentWeather | null;
  hourly: HourlyForecast | null;
  daily: DailyForecast | null;
  loading: boolean;
  lastUpdated: Date | null;
  error: string | null;
}

function createWeatherStore() {
  const initialStore: WeatherState = {
    current: null,
    hourly: null,
    daily: null,
    loading: false,
    lastUpdated: null,
    error: null
  };
  
  const { subscribe, update, set } = writable<WeatherState>(initialStore);
  
  return {
    subscribe,
    
    async loadWeather(coords: { latitude: number; longitude: number }) {
      update((state) => ({
        ...state,
        loading: true,
        error: null
      }));
      
      try {
        // In a real implementation, this would call the API
        // For now, we'll use mock data
        const mockData = {
          current: {
            location: {
              id: 'mock',
              name: {
                de: 'Neumarkt-Egna',
                it: 'Neumarkt-Egna',
                en: 'Neumarkt-Egna',
                ld: 'Neumarkt-Egna'
              },
              coordinates: coords,
              elevation: 262,
              region: 'bolzano',
              timezone: 'Europe/Rome'
            },
            timestamp: new Date(),
            timezone: 'Europe/Rome',
            temperature: { current: 15, min: 10, max: 20, unit: 'celsius' },
            feelsLike: 14,
            humidity: { relative: 65, dewpoint: 10 },
            wind: {
              speed: 12,
              gusts: 18,
              direction: { degrees: 180, cardinal: 'S' },
              beaufortScale: 3
            },
            pressure: { value: 1013, trend: 'steady' },
            visibility: { value: 10, category: 'excellent' },
            uv: { index: 3, category: 'moderate', recommendation: 'Schutz empfohlen' },
            precipitation: { probability: 10, amount: 0, type: 'none' },
            condition: {
              code: 1,
              description: {
                de: 'Überwiegend klar',
                it: 'Prevalentemente sereno',
                en: 'Mainly clear',
                ld: 'Prevalentemente sereno'
              },
              icon: 'partly-sunny',
              isNight: false
            },
            sun: {
              sunrise: new Date(),
              sunset: new Date(),
              solarNoon: new Date(),
              daylight: { hours: 12, minutes: 0 }
            }
          } as CurrentWeather,
          hourly: {
            location: {
              id: 'mock',
              name: {
                de: 'Neumarkt-Egna',
                it: 'Neumarkt-Egna',
                en: 'Neumarkt-Egna',
                ld: 'Neumarkt-Egna'
              },
              coordinates: coords,
              elevation: 262,
              region: 'bolzano',
              timezone: 'Europe/Rome'
            },
            hours: Array.from({ length: 24 }, (_, i) => ({
              timestamp: new Date(Date.now() + i * 3600 * 1000),
              temperature: 15 + Math.random() * 5,
              feelsLike: 15 + Math.random() * 5,
              humidity: 60 + Math.random() * 20,
              windSpeed: 10 + Math.random() * 5,
              windDirection: 180,
              windGusts: 15 + Math.random() * 5,
              precipitationProbability: 0,
              precipitationAmount: 0,
              weatherCode: 1,
              visibility: 10,
              isDay: true
            })),
            generatedAt: new Date(),
            expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
          } as HourlyForecast,
          daily: {
            location: {
              id: 'mock',
              name: {
                de: 'Neumarkt-Egna',
                it: 'Neumarkt-Egna',
                en: 'Neumarkt-Egna',
                ld: 'Neumarkt-Egna'
              },
              coordinates: coords,
              elevation: 262,
              region: 'bolzano',
              timezone: 'Europe/Rome'
            },
            days: Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() + i * 86400 * 1000),
              tempMax: 20 + Math.random() * 5,
              tempMin: 10 + Math.random() * 5,
              feelsLikeMax: 20 + Math.random() * 5,
              feelsLikeMin: 10 + Math.random() * 5,
              precipitationProbability: 0,
              precipitationSum: 0,
              weatherCode: 1,
              sunrise: new Date(),
              sunset: new Date(),
              uvIndexMax: 3,
              windSpeedMax: 15,
              windGustsMax: 20,
              windDirection: 180
            })),
            generatedAt: new Date(),
            expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
          } as DailyForecast
        };
        
        update((state) => ({
          ...state,
          current: mockData.current,
          hourly: mockData.hourly,
          daily: mockData.daily,
          loading: false,
          lastUpdated: new Date()
        }));
      } catch (error) {
        update((state) => ({
          ...state,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    },
    
    clear() {
      set(initialStore);
    }
  };
}

export const weatherStore = createWeatherStore();
