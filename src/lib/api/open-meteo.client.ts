/**
 * Open-Meteo API client for weather data
 */

import { HttpClient } from './http.client';
import type {
  OpenMeteoCurrentResponse,
  OpenMeteoHourlyResponse,
  OpenMeteoDailyResponse,
  OpenMeteoGeocodingResponse
} from '../types/api.types';
import type { Coordinates } from '../types/location.types';

export interface OpenMeteoClientOptions {
  baseUrl?: string;
  timeout?: number;
  userAgent?: string;
}

const DEFAULT_OPTIONS: OpenMeteoClientOptions = {
  baseUrl: 'https://api.open-meteo.com/v1',
  timeout: 10000,
  userAgent: 'SuedtirolWetter/2.0'
};

export class OpenMeteoClient {
  private client: HttpClient;
  private geocodingClient: HttpClient;

  constructor(options?: Partial<OpenMeteoClientOptions>) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    
    this.client = new HttpClient({
      baseUrl: opts.baseUrl,
      timeout: opts.timeout,
      headers: { 'User-Agent': opts.userAgent }
    });
    
    this.geocodingClient = new HttpClient({
      baseUrl: 'https://geocoding-api.open-meteo.com/v1',
      timeout: opts.timeout,
      headers: { 'User-Agent': opts.userAgent }
    });
  }

  /**
   * Get current weather for coordinates
   */
  async getCurrentWeather(
    coords: Coordinates,
    options: {
      temperature_unit?: 'celsius' | 'fahrenheit';
      wind_speed_unit?: 'kmh' | 'ms' | 'mph' | 'kn';
      timeformat?: 'iso8601' | 'unixtime';
      timezone?: string;
    } = {}
  ): Promise<OpenMeteoCurrentResponse> {
    const params = new URLSearchParams({
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'is_day'
      ].join(','),
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'sunrise',
        'sunset'
      ].join(','),
      timezone: options.timezone || 'auto',
      ...(options.temperature_unit && { temperature_unit: options.temperature_unit }),
      ...(options.wind_speed_unit && { wind_speed_unit: options.wind_speed_unit }),
      ...(options.timeformat && { timeformat: options.timeformat })
    });

    return this.client.get<OpenMeteoCurrentResponse>(
      `/forecast?${params.toString()}`
    );
  }

  /**
   * Get hourly forecast for coordinates
   */
  async getHourlyForecast(
    coords: Coordinates,
    options: {
      forecast_hours?: number;
      temperature_unit?: 'celsius' | 'fahrenheit';
      wind_speed_unit?: 'kmh' | 'ms' | 'mph' | 'kn';
      timeformat?: 'iso8601' | 'unixtime';
      timezone?: string;
    } = {}
  ): Promise<OpenMeteoHourlyResponse> {
    const params = new URLSearchParams({
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'is_day'
      ].join(','),
      timezone: options.timezone || 'auto',
      forecast_hours: (options.forecast_hours || 48).toString(),
      ...(options.temperature_unit && { temperature_unit: options.temperature_unit }),
      ...(options.wind_speed_unit && { wind_speed_unit: options.wind_speed_unit }),
      ...(options.timeformat && { timeformat: options.timeformat })
    });

    return this.client.get<OpenMeteoHourlyResponse>(
      `/forecast?${params.toString()}`
    );
  }

  /**
   * Get daily forecast for coordinates
   */
  async getDailyForecast(
    coords: Coordinates,
    options: {
      forecast_days?: number;
      temperature_unit?: 'celsius' | 'fahrenheit';
      wind_speed_unit?: 'kmh' | 'ms' | 'mph' | 'kn';
      timeformat?: 'iso8601' | 'unixtime';
      timezone?: string;
    } = {}
  ): Promise<OpenMeteoDailyResponse> {
    const params = new URLSearchParams({
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'wind_direction_10m_dominant'
      ].join(','),
      timezone: options.timezone || 'auto',
      forecast_days: (options.forecast_days || 7).toString(),
      ...(options.temperature_unit && { temperature_unit: options.temperature_unit }),
      ...(options.wind_speed_unit && { wind_speed_unit: options.wind_speed_unit }),
      ...(options.timeformat && { timeformat: options.timeformat })
    });

    return this.client.get<OpenMeteoDailyResponse>(
      `/forecast?${params.toString()}`
    );
  }

  /**
   * Get combined weather data (current + hourly + daily)
   */
  async getWeatherBundle(
    coords: Coordinates,
    options: {
      forecast_hours?: number;
      forecast_days?: number;
      temperature_unit?: 'celsius' | 'fahrenheit';
      wind_speed_unit?: 'kmh' | 'ms' | 'mph' | 'kn';
      timeformat?: 'iso8601' | 'unixtime';
      timezone?: string;
    } = {}
  ): Promise<{
    current: OpenMeteoCurrentResponse;
    hourly: OpenMeteoHourlyResponse;
    daily: OpenMeteoDailyResponse;
  }> {
    // For simplicity, we'll make separate requests
    // In a production environment, we might optimize this with Promise.all
    
    const [current, hourly, daily] = await Promise.all([
      this.getCurrentWeather(coords, options),
      this.getHourlyForecast(coords, { ...options, forecast_hours: options.forecast_hours || 48 }),
      this.getDailyForecast(coords, { ...options, forecast_days: options.forecast_days || 7 })
    ]);

    return { current, hourly, daily };
  }

  /**
   * Search for locations by name using Open-Meteo geocoding API
   */
  async searchLocations(
    query: string,
    options: {
      count?: number;
      language?: string;
      format?: 'json' | 'jsonf';
    } = {}
  ): Promise<OpenMeteoGeocodingResponse> {
    const params = new URLSearchParams({
      name: query,
      count: (options.count || 10).toString(),
      language: options.language || 'en',
      format: options.format || 'json'
    });

    return this.geocodingClient.get<OpenMeteoGeocodingResponse>(
      `/search?${params.toString()}`
    );
  }

  /**
   * Reverse geocode coordinates to find nearby locations
   */
  async reverseGeocode(
    coords: Coordinates,
    options: {
      language?: string;
    } = {}
  ): Promise<OpenMeteoGeocodingResponse> {
    const params = new URLSearchParams({
      latitude: coords.latitude.toString(),
      longitude: coords.longitude.toString(),
      language: options.language || 'en'
    });

    return this.geocodingClient.get<OpenMeteoGeocodingResponse>(
      `/search?${params.toString()}`
    );
  }
}