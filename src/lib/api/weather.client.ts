import type { Coordinates, CurrentWeather, HourlyForecast, DailyForecast } from '$lib/types/weather.types';

const BASE_URL = 'https://api.open-meteo.com/v1';

interface WeatherOptions {
  temperatureUnit?: 'celsius' | 'fahrenheit';
  windSpeedUnit?: 'kmh' | 'ms' | 'mph' | 'kn';
  timeFormat?: '24h' | '12h';
}

const DEFAULT_OPTIONS: WeatherOptions = {
  temperatureUnit: 'celsius',
  windSpeedUnit: 'kmh',
  timeFormat: '24h'
};

class WeatherClient {
  private baseUrl: string;
  private options: WeatherOptions;

  constructor(options: Partial<WeatherOptions> = {}) {
    this.baseUrl = BASE_URL;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Get current weather for coordinates
   */
  async getCurrentWeather(coords: Coordinates, params?: {
    hourly?: string[];
    daily?: string[];
    timezone?: string;
    forecastDays?: number;
  }): Promise<CurrentWeather> {
    const url = new URL(`${this.baseUrl}/forecast`);
    
    url.searchParams.set('latitude', coords.latitude.toString());
    url.searchParams.set('longitude', coords.longitude.toString());
    
    const currentParams = [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m'
    ];
    
    url.searchParams.set('current', currentParams.join(','));
    url.searchParams.set('timezone', 'Europe/Rome');
    
    if (params?.forecastDays) {
      url.searchParams.set('forecast_days', params.forecastDays.toString());
    }
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return this.transformCurrentWeather(data, coords);
  }

  /**
   * Get hourly forecast
   */
  async getHourlyForecast(coords: Coordinates, hours: number = 48): Promise<HourlyForecast> {
    const url = new URL(`${this.baseUrl}/forecast`);
    
    url.searchParams.set('latitude', coords.latitude.toString());
    url.searchParams.set('longitude', coords.longitude.toString());
    
    const hourlyParams = [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'visibility',
      'is_day'
    ];
    
    url.searchParams.set('hourly', hourlyParams.join(','));
    url.searchParams.set('timezone', 'Europe/Rome');
    url.searchParams.set('forecast_hours', hours.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return this.transformHourlyForecast(data, coords);
  }

  /**
   * Get daily forecast
   */
  async getDailyForecast(coords: Coordinates, days: number = 7): Promise<DailyForecast> {
    const url = new URL(`${this.baseUrl}/forecast`);
    
    url.searchParams.set('latitude', coords.latitude.toString());
    url.searchParams.set('longitude', coords.longitude.toString());
    
    const dailyParams = [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant'
    ];
    
    url.searchParams.set('daily', dailyParams.join(','));
    url.searchParams.set('timezone', 'Europe/Rome');
    url.searchParams.set('forecast_days', days.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return this.transformDailyForecast(data, coords);
  }

  /**
   * Get all weather data in a single request
   */
  async getWeatherBundle(coords: Coordinates): Promise<{
    current: CurrentWeather;
    hourly: HourlyForecast;
    daily: DailyForecast;
  }> {
    const url = new URL(`${this.baseUrl}/forecast`);
    
    url.searchParams.set('latitude', coords.latitude.toString());
    url.searchParams.set('longitude', coords.longitude.toString());
    
    const currentParams = [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m'
    ];
    
    const hourlyParams = [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'visibility',
      'is_day'
    ];
    
    const dailyParams = [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant'
    ];
    
    url.searchParams.set('current', currentParams.join(','));
    url.searchParams.set('hourly', hourlyParams.join(','));
    url.searchParams.set('daily', dailyParams.join(','));
    url.searchParams.set('timezone', 'Europe/Rome');
    url.searchParams.set('forecast_days', '7');
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      current: this.transformCurrentWeather(data, coords),
      hourly: this.transformHourlyForecast(data, coords),
      daily: this.transformDailyForecast(data, coords)
    };
  }

  // Transformation methods

  private transformCurrentWeather(data: any, coords: Coordinates): CurrentWeather {
    const current = data.current;
    const time = new Date(current.time);
    
    return {
      location: {
        id: `weather-${coords.latitude.toFixed(2)}-${coords.longitude.toFixed(2)}`,
        name: {
          de: `Standort ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
          it: `Posizione ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
          en: `Location ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
          ld: `Posiziun ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`
        },
        coordinates: coords,
        elevation: 0,
        region: 'unknown',
        timezone: data.timezone || 'Europe/Rome'
      },
      timestamp: time,
      timezone: data.timezone || 'Europe/Rome',
      
      temperature: {
        current: current.temperature_2m,
        min: current.temperature_2m,
        max: current.temperature_2m,
        unit: this.options.temperatureUnit
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
          cardinal: this.degreesToCardinal(current.wind_direction_10m)
        },
        beaufortScale: this.beaufortScale(current.wind_speed_10m)
      },
      pressure: {
        value: current.pressure_msl,
        trend: this.determinePressureTrend(current.pressure_msl)
      },
      visibility: {
        value: this.visibilityFromCloudCover(current.cloud_cover),
        category: this.visibilityCategory(this.visibilityFromCloudCover(current.cloud_cover))
      },
      uv: {
        index: 0,
        category: 'low',
        recommendation: 'UV-Index niedrig'
      },
      precipitation: {
        probability: 0,
        amount: current.precipitation,
        type: this.precipitationType(current.weather_code, current.temperature_2m)
      },
      condition: {
        code: current.weather_code as any,
        description: this.weatherDescription(current.weather_code),
        icon: this.weatherIcon(current.weather_code, current.is_day === 1),
        isNight: current.is_day === 0
      },
      sun: {
        sunrise: time,
        sunset: time,
        solarNoon: time,
        daylight: { hours: 12, minutes: 0 }
      }
    };
  }

  private transformHourlyForecast(data: any, coords: Coordinates): HourlyForecast {
    const hourly = data.hourly;
    
    return {
      location: {
        id: `weather-${coords.latitude.toFixed(2)}-${coords.longitude.toFixed(2)}`,
        name: {
          de: `Standort ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
          it: `Posizione ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
          en: `Location ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
          ld: `Posiziun ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`
        },
        coordinates: coords,
        elevation: 0,
        region: 'unknown',
        timezone: data.timezone || 'Europe/Rome'
      },
      hours: hourly.time.map((time: string, index: number) => ({
        timestamp: new Date(time),
        temperature: hourly.temperature_2m[index],
        feelsLike: hourly.apparent_temperature[index],
        humidity: hourly.relative_humidity_2m[index],
        windSpeed: hourly.wind_speed_10m[index],
        windDirection: hourly.wind_direction_10m[index],
        windGusts: hourly.wind_gusts_10m[index],
        precipitationProbability: hourly.precipitation_probability[index],
        precipitationAmount: hourly.precipitation[index],
        weatherCode: hourly.weather_code[index] as any,
        visibility: hourly.visibility[index],
        isDay: hourly.is_day[index] === 1
      })),
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours
    };
  }

  private transformDailyForecast(data: any, coords: Coordinates): DailyForecast {
    const daily = data.daily;
    
    return {
      location: {
        id: `weather-${coords.latitude.toFixed(2)}-${coords.longitude.toFixed(2)}`,
        name: {
          de: `Standort ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
          it: `Posizione ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
          en: `Location ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`,
          ld: `Posiziun ${coords.latitude.toFixed(2)}, ${coords.longitude.toFixed(2)}`
        },
        coordinates: coords,
        elevation: 0,
        region: 'unknown',
        timezone: data.timezone || 'Europe/Rome'
      },
      days: daily.time.map((date: string, index: number) => ({
        date: new Date(date),
        tempMax: daily.temperature_2m_max[index],
        tempMin: daily.temperature_2m_min[index],
        feelsLikeMax: daily.apparent_temperature_max[index],
        feelsLikeMin: daily.apparent_temperature_min[index],
        precipitationProbability: daily.precipitation_probability_max[index],
        precipitationSum: daily.precipitation_sum[index],
        weatherCode: daily.weather_code[index] as any,
        sunrise: new Date(daily.sunrise[index]),
        sunset: new Date(daily.sunset[index]),
        uvIndexMax: 0,
        windSpeedMax: daily.wind_speed_10m_max[index],
        windGustsMax: daily.wind_gusts_10m_max[index],
        windDirection: daily.wind_direction_10m_dominant[index]
      })),
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours
    };
  }

  // Helper methods

  private calculateDewPoint(temp: number, humidity: number): number {
    const a = 17.27;
    const b = 237.7;
    const alpha = ((a * temp) / (b + temp)) + Math.log(humidity / 100);
    return (b * alpha) / (a - alpha);
  }

  private degreesToCardinal(degrees: number): string {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }

  private beaufortScale(windSpeed: number): number {
    if (windSpeed < 1) return 0;
    if (windSpeed < 5) return 1;
    if (windSpeed < 12) return 2;
    if (windSpeed < 20) return 3;
    if (windSpeed < 31) return 4;
    if (windSpeed < 41) return 5;
    if (windSpeed < 55) return 6;
    if (windSpeed < 72) return 7;
    if (windSpeed < 90) return 8;
    if (windSpeed < 109) return 9;
    if (windSpeed < 128) return 10;
    if (windSpeed < 149) return 11;
    return 12;
  }

  private determinePressureTrend(pressure: number): 'rising' | 'falling' | 'steady' {
    if (pressure < 980) return 'falling';
    if (pressure > 1030) return 'rising';
    return 'steady';
  }

  private visibilityFromCloudCover(cloudCover: number): number {
    // Estimate visibility from cloud cover percentage
    if (cloudCover < 10) return 10;
    if (cloudCover < 30) return 8;
    if (cloudCover < 60) return 6;
    if (cloudCover < 90) return 4;
    return 2;
  }

  private visibilityCategory(visibility: number): 'excellent' | 'good' | 'moderate' | 'poor' {
    if (visibility >= 10) return 'excellent';
    if (visibility >= 5) return 'good';
    if (visibility >= 2) return 'moderate';
    return 'poor';
  }

  private precipitationType(code: number, temp: number): 'none' | 'rain' | 'sleet' | 'snow' | 'hail' {
    if (code === 0 || code === 1) return 'none';
    if (code >= 51 && code <= 57) return 'rain';
    if (code >= 61 && code <= 67) {
      return temp < 0 ? 'sleet' : 'rain';
    }
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 85 && code <= 86) return 'snow';
    if (code >= 95) return 'hail';
    return 'none';
  }

  private weatherDescription(code: number): string {
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
      61: 'Leichter Regen',
      63: 'Regen',
      65: 'Starker Regen',
      71: 'Leichter Schneefall',
      73: 'Schneefall',
      75: 'Starker Schneefall',
      80: 'Leichte Regenschauer',
      81: 'Regenschauer',
      82: 'Starke Regenschauer',
      95: 'Gewitter',
      96: 'Gewitter mit leichtem Hagel',
      99: 'Gewitter mit starkem Hagel'
    };
    return descriptions[code] || 'Wetterinformation unavailable';
  }

  private weatherIcon(code: number, isDay: boolean): string {
    const icons: Record<string, string> = {
      '0-day': 'sunny',
      '0-night': 'clear-night',
      '1-day': 'partly-sunny',
      '1-night': 'partly-cloudy-night',
      '2-day': 'partly-cloudy',
      '2-night': 'partly-cloudy-night',
      '3': 'cloudy',
      '45': 'fog',
      '48': 'fog-rime',
      '51': 'drizzle',
      '53': 'drizzle',
      '55': 'drizzle',
      '56': 'freezing-drizzle',
      '57': 'freezing-drizzle',
      '61': 'rain',
      '63': 'rain',
      '65': 'rain',
      '66': 'freezing-rain',
      '67': 'freezing-rain',
      '71': 'snow',
      '73': 'snow',
      '75': 'snow',
      '77': 'snow-grains',
      '80': 'rain-showers',
      '81': 'rain-showers',
      '82': 'rain-showers',
      '85': 'snow-showers',
      '86': 'snow-showers',
      '95': 'thunderstorm',
      '96': 'thunderstorm-hail',
      '99': 'thunderstorm-hail'
    };
    
    const key = `${code}-${isDay ? 'day' : 'night'}`;
    return icons[key] || 'question-mark';
  }
}

export const weatherClient = new WeatherClient();
