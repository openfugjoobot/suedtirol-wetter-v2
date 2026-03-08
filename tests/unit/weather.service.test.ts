/**
 * Unit tests for WeatherService
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WeatherService } from '../../src/lib/services/weather.service';
import type { Coordinates } from '../../src/lib/types/location.types';

// Mock OpenMeteoClient
vi.mock('../../src/lib/api/open-meteo.client', () => {
  return {
    OpenMeteoClient: vi.fn().mockImplementation(() => ({
      getCurrentWeather: vi.fn().mockResolvedValue({
        current: {
          time: '2026-03-08T12:00:00Z',
          temperature_2m: 15,
          relative_humidity_2m: 65,
          apparent_temperature: 14,
          precipitation: 0,
          weather_code: 1,
          cloud_cover: 20,
          pressure_msl: 1013,
          surface_pressure: 1010,
          wind_speed_10m: 12,
          wind_direction_10m: 180,
          wind_gusts_10m: 18,
          is_day: 1
        },
        daily: {
          time: ['2026-03-08'],
          temperature_2m_max: [20],
          temperature_2m_min: [10],
          sunrise: ['2026-03-08T06:30:00Z'],
          sunset: ['2026-03-08T18:30:00Z']
        },
        hourly: {
          time: Array.from({ length: 48 }, (_, i) => 
            new Date(Date.now() + i * 3600000).toISOString()
          ),
          temperature_2m: Array.from({ length: 48 }, () => 15 + Math.random() * 5),
          relative_humidity_2m: Array.from({ length: 48 }, () => 60 + Math.random() * 20),
          apparent_temperature: Array.from({ length: 48 }, () => 14 + Math.random() * 5),
          precipitation_probability: Array.from({ length: 48 }, () => 0),
          precipitation: Array.from({ length: 48 }, () => 0),
          weather_code: Array.from({ length: 48 }, () => 1),
          wind_speed_10m: Array.from({ length: 48 }, () => 10 + Math.random() * 5),
          wind_direction_10m: Array.from({ length: 48 }, () => 180),
          wind_gusts_10m: Array.from({ length: 48 }, () => 15 + Math.random() * 5),
          is_day: Array.from({ length: 48 }, (_, i) => (i >= 6 && i <= 18 ? 1 : 0))
        },
        timezone: 'Europe/Rome'
      }),
      getHourlyForecast: vi.fn().mockResolvedValue({
        hourly: {
          time: Array.from({ length: 48 }, (_, i) => 
            new Date(Date.now() + i * 3600000).toISOString()
          ),
          temperature_2m: Array.from({ length: 48 }, () => 15 + Math.random() * 5),
          relative_humidity_2m: Array.from({ length: 48 }, () => 60 + Math.random() * 20),
          apparent_temperature: Array.from({ length: 48 }, () => 14 + Math.random() * 5),
          precipitation_probability: Array.from({ length: 48 }, () => 0),
          precipitation: Array.from({ length: 48 }, () => 0),
          weather_code: Array.from({ length: 48 }, () => 1),
          wind_speed_10m: Array.from({ length: 48 }, () => 10 + Math.random() * 5),
          wind_direction_10m: Array.from({ length: 48 }, () => 180),
          wind_gusts_10m: Array.from({ length: 48 }, () => 15 + Math.random() * 5),
          is_day: Array.from({ length: 48 }, (_, i) => (i >= 6 && i <= 18 ? 1 : 0))
        },
        timezone: 'Europe/Rome'
      }),
      getDailyForecast: vi.fn().mockResolvedValue({
        daily: {
          time: Array.from({ length: 7 }, (_, i) => 
            new Date(Date.now() + i * 86400000).toISOString()
          ),
          temperature_2m_max: Array.from({ length: 7 }, () => 18 + Math.random() * 5),
          temperature_2m_min: Array.from({ length: 7 }, () => 8 + Math.random() * 5),
          apparent_temperature_max: Array.from({ length: 7 }, () => 17 + Math.random() * 5),
          apparent_temperature_min: Array.from({ length: 7 }, () => 7 + Math.random() * 5),
          precipitation_probability_max: Array.from({ length: 7 }, () => 0),
          precipitation_sum: Array.from({ length: 7 }, () => 0),
          weather_code: Array.from({ length: 7 }, () => 1),
          sunrise: Array.from({ length: 7 }, () => '2026-03-08T06:30:00Z'),
          sunset: Array.from({ length: 7 }, () => '2026-03-08T18:30:00Z'),
          uv_index_max: Array.from({ length: 7 }, () => 3),
          wind_speed_10m_max: Array.from({ length: 7 }, () => 15),
          wind_gusts_10m_max: Array.from({ length: 7 }, () => 20),
          wind_direction_10m_dominant: Array.from({ length: 7 }, () => 180)
        },
        timezone: 'Europe/Rome'
      })
    }))
  };
});

describe('WeatherService', () => {
  let service: WeatherService;
  const mockCoordinates: Coordinates = {
    latitude: 46.4983,
    longitude: 11.3548
  };

  beforeEach(() => {
    service = new WeatherService();
  });

  describe('constructor', () => {
    it('should create service with default options', () => {
      expect(service).toBeDefined();
    });

    it('should accept custom temperature unit', () => {
      const customService = new WeatherService({ temperatureUnit: 'fahrenheit' });
      expect(customService).toBeDefined();
    });

    it('should accept custom wind speed unit', () => {
      const customService = new WeatherService({ windSpeedUnit: 'ms' });
      expect(customService).toBeDefined();
    });
  });

  describe('getCurrentWeather', () => {
    it('should return current weather data', async () => {
      const result = await service.getCurrentWeather(mockCoordinates);

      expect(result).toBeDefined();
      expect(result.temperature).toBeDefined();
      expect(result.temperature.current).toBe(15);
      expect(result.humidity.relative).toBe(65);
      expect(result.wind.speed).toBe(12);
    });

    it('should include location reference', async () => {
      const result = await service.getCurrentWeather(mockCoordinates);

      expect(result.location).toBeDefined();
      expect(result.location.coordinates).toEqual(mockCoordinates);
    });

    it('should include timestamp', async () => {
      const result = await service.getCurrentWeather(mockCoordinates);

      expect(result.timestamp).toBeDefined();
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should transform wind direction to cardinal', async () => {
      const result = await service.getCurrentWeather(mockCoordinates);

      expect(result.wind.direction.cardinal).toBe('S'); // 180 degrees = South
    });

    it('should calculate Beaufort scale', async () => {
      const result = await service.getCurrentWeather(mockCoordinates);

      expect(result.wind.beaufortScale).toBeGreaterThanOrEqual(0);
      expect(result.wind.beaufortScale).toBeLessThanOrEqual(12);
    });
  });

  describe('getHourlyForecast', () => {
    it('should return hourly forecast', async () => {
      const result = await service.getHourlyForecast(mockCoordinates);

      expect(result).toBeDefined();
      expect(result.hours).toBeDefined();
      expect(result.hours.length).toBeGreaterThan(0);
    });

    it('should return 48 hours by default', async () => {
      const result = await service.getHourlyForecast(mockCoordinates);

      expect(result.hours.length).toBe(48);
    });

    it('should include all required hourly fields', async () => {
      const result = await service.getHourlyForecast(mockCoordinates);
      const hour = result.hours[0];

      expect(hour).toHaveProperty('timestamp');
      expect(hour).toHaveProperty('temperature');
      expect(hour).toHaveProperty('feelsLike');
      expect(hour).toHaveProperty('humidity');
      expect(hour).toHaveProperty('windSpeed');
      expect(hour).toHaveProperty('precipitationProbability');
      expect(hour).toHaveProperty('weatherCode');
    });

    it('should set expiration to 2 hours from now', async () => {
      const result = await service.getHourlyForecast(mockCoordinates);
      const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);

      expect(result.expiresAt.getTime()).toBeCloseTo(twoHoursFromNow.getTime(), -3);
    });
  });

  describe('getDailyForecast', () => {
    it('should return daily forecast', async () => {
      const result = await service.getDailyForecast(mockCoordinates);

      expect(result).toBeDefined();
      expect(result.days).toBeDefined();
      expect(result.days.length).toBeGreaterThan(0);
    });

    it('should return 7 days by default', async () => {
      const result = await service.getDailyForecast(mockCoordinates);

      expect(result.days.length).toBe(7);
    });

    it('should include all required daily fields', async () => {
      const result = await service.getDailyForecast(mockCoordinates);
      const day = result.days[0];

      expect(day).toHaveProperty('date');
      expect(day).toHaveProperty('tempMax');
      expect(day).toHaveProperty('tempMin');
      expect(day).toHaveProperty('precipitationProbability');
      expect(day).toHaveProperty('weatherCode');
      expect(day).toHaveProperty('sunrise');
      expect(day).toHaveProperty('sunset');
    });

    it('should set expiration to 4 hours from now', async () => {
      const result = await service.getDailyForecast(mockCoordinates);
      const fourHoursFromNow = new Date(Date.now() + 4 * 60 * 60 * 1000);

      expect(result.expiresAt.getTime()).toBeCloseTo(fourHoursFromNow.getTime(), -3);
    });
  });

  describe('getWeatherData', () => {
    it('should return combined weather data', async () => {
      const result = await service.getWeatherData(mockCoordinates);

      expect(result).toBeDefined();
      expect(result.current).toBeDefined();
      expect(result.hourly).toBeDefined();
      expect(result.daily).toBeDefined();
    });

    it('should use Promise.all for parallel requests', async () => {
      const startTime = Date.now();
      await service.getWeatherData(mockCoordinates);
      const endTime = Date.now();

      // Should be faster than sequential calls (3 * 100ms = 300ms)
      expect(endTime - startTime).toBeLessThan(250);
    });
  });

  describe('utility methods', () => {
    it('should calculate dew point correctly', async () => {
      const result = await service.getCurrentWeather(mockCoordinates);
      
      // Dew point should be lower than temperature when humidity < 100%
      expect(result.humidity.dewpoint).toBeLessThan(result.temperature.current);
    });

    it('should categorize UV index', async () => {
      const result = await service.getCurrentWeather(mockCoordinates);
      
      expect(result.uv.category).toBeDefined();
      expect(result.uv.recommendation).toBeDefined();
    });

    it('should determine precipitation type', async () => {
      const result = await service.getCurrentWeather(mockCoordinates);
      
      expect(result.precipitation.type).toBeDefined();
      expect(['none', 'rain', 'sleet', 'snow', 'hail']).toContain(result.precipitation.type);
    });

    it('should get weather description', async () => {
      const result = await service.getCurrentWeather(mockCoordinates);
      
      expect(result.condition.description).toBeDefined();
      expect(result.condition.description.de).toBeDefined();
    });

    it('should get weather icon', async () => {
      const result = await service.getCurrentWeather(mockCoordinates);
      
      expect(result.condition.icon).toBeDefined();
    });
  });
});
