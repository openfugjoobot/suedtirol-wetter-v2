/**
 * Weather service - Business logic layer for weather data
 */

import type { Coordinates } from '../types/location.types';
import type {
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  TemperatureData,
  HumidityData,
  WindData,
  PressureData,
  VisibilityData,
  UVData,
  PrecipitationData,
  WeatherCondition,
  SunData,
  HourlyData,
  DailyData
} from '../types/weather.types';
import type {
  OpenMeteoCurrentResponse,
  OpenMeteoHourlyResponse,
  OpenMeteoDailyResponse
} from '../types/api.types';

import { OpenMeteoClient } from '../api/open-meteo.client';

export interface WeatherServiceOptions {
  temperatureUnit?: 'celsius' | 'fahrenheit';
  windSpeedUnit?: 'kmh' | 'ms' | 'mph' | 'kn';
}

export class WeatherService {
  private client: OpenMeteoClient;
  private temperatureUnit: 'celsius' | 'fahrenheit';
  private windSpeedUnit: 'kmh' | 'ms' | 'mph' | 'kn';

  constructor(options: WeatherServiceOptions = {}) {
    this.client = new OpenMeteoClient();
    this.temperatureUnit = options.temperatureUnit || 'celsius';
    this.windSpeedUnit = options.windSpeedUnit || 'kmh';
  }

  /**
   * Get current weather for coordinates
   */
  async getCurrentWeather(coords: Coordinates): Promise<CurrentWeather> {
    const data = await this.client.getCurrentWeather(coords, {
      temperature_unit: this.temperatureUnit,
      wind_speed_unit: this.windSpeedUnit
    });

    return this.transformCurrentWeather(data, coords);
  }

  /**
   * Get hourly forecast for coordinates
   */
  async getHourlyForecast(coords: Coordinates): Promise<HourlyForecast> {
    const data = await this.client.getHourlyForecast(coords, {
      forecast_hours: 48,
      temperature_unit: this.temperatureUnit,
      wind_speed_unit: this.windSpeedUnit
    });

    return this.transformHourlyForecast(data, coords);
  }

  /**
   * Get daily forecast for coordinates
   */
  async getDailyForecast(coords: Coordinates): Promise<DailyForecast> {
    const data = await this.client.getDailyForecast(coords, {
      forecast_days: 7,
      temperature_unit: this.temperatureUnit,
      wind_speed_unit: this.windSpeedUnit
    });

    return this.transformDailyForecast(data, coords);
  }

  /**
   * Get all weather data for coordinates
   */
  async getWeatherData(coords: Coordinates): Promise<{
    current: CurrentWeather;
    hourly: HourlyForecast;
    daily: DailyForecast;
  }> {
    const [current, hourly, daily] = await Promise.all([
      this.getCurrentWeather(coords),
      this.getHourlyForecast(coords),
      this.getDailyForecast(coords)
    ]);

    return { current, hourly, daily };
  }

  /**
   * Transform Open-Meteo current weather response to our data model
   */
  private transformCurrentWeather(
    data: OpenMeteoCurrentResponse,
    coords: Coordinates
  ): CurrentWeather {
    const current = data.current;
    const daily = data.daily;

    // Create a basic location reference
    const location: any = {
      id: `${coords.latitude},${coords.longitude}`,
      name: { de: '', it: '', en: '', ld: '' }, // Will be filled by location service
      coordinates: coords
    };

    return {
      location,
      timestamp: new Date(current.time),
      timezone: data.timezone,

      temperature: {
        current: current.temperature_2m,
        min: daily?.temperature_2m_min?.[0] ?? current.temperature_2m,
        max: daily?.temperature_2m_max?.[0] ?? current.temperature_2m,
        unit: this.temperatureUnit
      },

      feelsLike: current.apparent_temperature,

      humidity: {
        relative: current.relative_humidity_2m,
        dewpoint: this.calculateDewPoint(current.temperature_2m, current.relative_humidity_2m)
      },

      wind: {
        speed: current.wind_speed_10m,
        gusts: current.wind_gusts_10m,
        direction: {
          degrees: current.wind_direction_10m,
          cardinal: this.getCardinalDirection(current.wind_direction_10m)
        },
        beaufortScale: this.convertToBeaufort(current.wind_speed_10m)
      },

      pressure: {
        value: current.surface_pressure,
        trend: 'steady' // Would need historical data to determine trend
      },

      visibility: {
        value: current.visibility || 10, // Default to 10km if not provided
        category: this.getVisibilityCategory(current.visibility || 10)
      },

      uv: {
        index: current.uv_index || 0,
        category: this.getUVCategory(current.uv_index || 0),
        recommendation: this.getUVRecommendation(current.uv_index || 0)
      },

      precipitation: {
        probability: 0, // Not directly available in current weather
        amount: current.precipitation,
        type: this.getPrecipitationType(current.weather_code, current.temperature_2m)
      },

      condition: {
        code: current.weather_code as any,
        description: this.getWeatherDescription(current.weather_code),
        icon: this.getWeatherIcon(current.weather_code, current.is_day === 1),
        isNight: current.is_day !== 1
      },

      sun: daily ? {
        sunrise: new Date(daily.sunrise[0]),
        sunset: new Date(daily.sunset[0]),
        solarNoon: this.calculateSolarNoon(new Date(daily.sunrise[0]), new Date(daily.sunset[0])),
        daylight: this.calculateDaylightDuration(new Date(daily.sunrise[0]), new Date(daily.sunset[0]))
      } : {
        sunrise: new Date(),
        sunset: new Date(),
        solarNoon: new Date(),
        daylight: { hours: 0, minutes: 0 }
      }
    };
  }

  /**
   * Transform Open-Meteo hourly forecast response to our data model
   */
  private transformHourlyForecast(
    data: OpenMeteoHourlyResponse,
    coords: Coordinates
  ): HourlyForecast {
    const hourly = data.hourly;

    // Create a basic location reference
    const location: any = {
      id: `${coords.latitude},${coords.longitude}`,
      name: { de: '', it: '', en: '', ld: '' }, // Will be filled by location service
      coordinates: coords
    };

    const hours: HourlyData[] = [];
    for (let i = 0; i < hourly.time.length; i++) {
      hours.push({
        timestamp: new Date(hourly.time[i]),
        temperature: hourly.temperature_2m[i],
        feelsLike: hourly.apparent_temperature[i],
        humidity: hourly.relative_humidity_2m[i],
        windSpeed: hourly.wind_speed_10m[i],
        windDirection: hourly.wind_direction_10m[i],
        windGusts: hourly.wind_gusts_10m[i],
        precipitationProbability: hourly.precipitation_probability[i],
        precipitationAmount: hourly.precipitation[i],
        weatherCode: hourly.weather_code[i] as any,
        visibility: hourly.visibility?.[i] || 10,
        isDay: hourly.is_day[i] === 1
      });
    }

    return {
      location,
      hours,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
    };
  }

  /**
   * Transform Open-Meteo daily forecast response to our data model
   */
  private transformDailyForecast(
    data: OpenMeteoDailyResponse,
    coords: Coordinates
  ): DailyForecast {
    const daily = data.daily;

    // Create a basic location reference
    const location: any = {
      id: `${coords.latitude},${coords.longitude}`,
      name: { de: '', it: '', en: '', ld: '' }, // Will be filled by location service
      coordinates: coords
    };

    const days: DailyData[] = [];
    for (let i = 0; i < daily.time.length; i++) {
      days.push({
        date: new Date(daily.time[i]),
        tempMax: daily.temperature_2m_max[i],
        tempMin: daily.temperature_2m_min[i],
        feelsLikeMax: daily.apparent_temperature_max[i],
        feelsLikeMin: daily.apparent_temperature_min[i],
        precipitationProbability: daily.precipitation_probability_max[i],
        precipitationSum: daily.precipitation_sum[i],
        weatherCode: daily.weather_code[i] as any,
        sunrise: new Date(daily.sunrise[i]),
        sunset: new Date(daily.sunset[i]),
        uvIndexMax: daily.uv_index_max[i],
        windSpeedMax: daily.wind_speed_10m_max[i],
        windGustsMax: daily.wind_gusts_10m_max[i],
        windDirection: daily.wind_direction_10m_dominant[i]
      });
    }

    return {
      location,
      days,
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours from now
    };
  }

  // Utility methods

  private calculateDewPoint(temperature: number, humidity: number): number {
    // Magnus formula for calculating dew point
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
    return (b * alpha) / (a - alpha);
  }

  private getCardinalDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  private convertToBeaufort(windSpeedKmh: number): number {
    // Simplified Beaufort scale conversion
    if (windSpeedKmh < 1) return 0;
    if (windSpeedKmh < 6) return 1;
    if (windSpeedKmh < 12) return 2;
    if (windSpeedKmh < 20) return 3;
    if (windSpeedKmh < 29) return 4;
    if (windSpeedKmh < 39) return 5;
    if (windSpeedKmh < 50) return 6;
    if (windSpeedKmh < 62) return 7;
    if (windSpeedKmh < 75) return 8;
    if (windSpeedKmh < 89) return 9;
    if (windSpeedKmh < 103) return 10;
    if (windSpeedKmh < 118) return 11;
    return 12;
  }

  private getVisibilityCategory(km: number): VisibilityData['category'] {
    if (km >= 10) return 'excellent';
    if (km >= 5) return 'good';
    if (km >= 2) return 'moderate';
    return 'poor';
  }

  private getUVCategory(index: number): UVData['category'] {
    if (index <= 2) return 'low';
    if (index <= 5) return 'moderate';
    if (index <= 7) return 'high';
    if (index <= 10) return 'very-high';
    return 'extreme';
  }

  private getUVRecommendation(index: number): string {
    if (index <= 2) return 'No protection needed';
    if (index <= 5) return 'Protection recommended';
    if (index <= 7) return 'Protection needed';
    if (index <= 10) return 'Extra protection needed';
    return 'Maximum protection needed';
  }

  private getPrecipitationType(weatherCode: number, temperature: number): PrecipitationData['type'] {
    // Simplified precipitation type determination
    if ([51, 53, 55, 56, 57].includes(weatherCode)) {
      return temperature < 0 ? 'sleet' : 'rain';
    }
    if ([61, 63, 65, 66, 67].includes(weatherCode)) {
      return temperature < 0 ? 'sleet' : 'rain';
    }
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
      return 'snow';
    }
    if ([80, 81, 82].includes(weatherCode)) {
      return temperature < 0 ? 'sleet' : 'rain';
    }
    return 'none';
  }

  private getWeatherDescription(code: number): LocalizedString {
    // Return German descriptions for now, would normally be i18n-aware
    const descriptions: Record<number, string> = {
      0: 'Klarer Himmel',
      1: 'Überwiegend klar',
      2: 'Teilweise bewölkt',
      3: 'Bedeckt',
      45: 'Nebel',
      48: 'Nebel mit Reifansatz',
      51: 'Leichter Nieselregen',
      53: 'Nieselregen',
      55: 'Starker Nieselregen',
      56: 'Leichter gefrierender Nieselregen',
      57: 'Starker gefrierender Nieselregen',
      61: 'Leichter Regen',
      63: 'Regen',
      65: 'Starker Regen',
      66: 'Leichter gefrierender Regen',
      67: 'Starker gefrierender Regen',
      71: 'Leichter Schneefall',
      73: 'Schneefall',
      75: 'Starker Schneefall',
      77: 'Schneegriesel',
      80: 'Leichte Regenschauer',
      81: 'Regenschauer',
      82: 'Starke Regenschauer',
      95: 'Gewitter',
      96: 'Gewitter mit leichtem Hagel',
      99: 'Gewitter mit starkem Hagel'
    };

    const description = descriptions[code] || 'Unbekannt';
    return {
      de: description,
      it: description,
      en: description,
      ld: description
    };
  }

  private getWeatherIcon(code: number, isDay: boolean): string {
    // Simple mapping to icon identifiers
    const prefix = isDay ? 'day' : 'night';
    const icons: Record<number, string> = {
      0: `${prefix}-clear`,
      1: `${prefix}-mostly-clear`,
      2: `${prefix}-partly-cloudy`,
      3: 'cloudy',
      45: 'fog',
      48: 'fog',
      51: 'drizzle-light',
      53: 'drizzle',
      55: 'drizzle-heavy',
      56: 'freezing-drizzle-light',
      57: 'freezing-drizzle-heavy',
      61: 'rain-light',
      63: 'rain',
      65: 'rain-heavy',
      66: 'freezing-rain-light',
      67: 'freezing-rain-heavy',
      71: 'snow-light',
      73: 'snow',
      75: 'snow-heavy',
      77: 'snow-grains',
      80: 'showers-light',
      81: 'showers',
      82: 'showers-heavy',
      95: 'thunderstorm',
      96: 'thunderstorm-hail-light',
      99: 'thunderstorm-hail-heavy'
    };

    return icons[code] || 'unknown';
  }

  private calculateSolarNoon(sunrise: Date, sunset: Date): Date {
    const noon = new Date(sunrise);
    const diff = sunset.getTime() - sunrise.getTime();
    noon.setTime(sunrise.getTime() + diff / 2);
    return noon;
  }

  private calculateDaylightDuration(sunrise: Date, sunset: Date): { hours: number; minutes: number } {
    const diff = sunset.getTime() - sunrise.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  }
}