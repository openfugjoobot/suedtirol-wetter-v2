/** Current weather conditions */
export interface CurrentWeather {
  location: LocationReference;
  timestamp: Date;
  timezone: string;
  
  temperature: TemperatureData;
  feelsLike: number;
  humidity: HumidityData;
  wind: WindData;
  pressure: PressureData;
  visibility: VisibilityData;
  uv: UVData;
  precipitation: PrecipitationData;
  condition: WeatherCondition;
  sun: SunData;
}

export interface TemperatureData {
  current: number;           // Current temperature (°C)
  min: number;               // Daily low
  max: number;               // Daily high
  unit: 'celsius' | 'fahrenheit';
}

export interface HumidityData {
  relative: number;          // Percentage (0-100)
  dewpoint: number;          // °C
}

export interface WindData {
  speed: number;             // km/h
  gusts: number;             // km/h
  direction: WindDirection; // degrees + cardinal
  beaufortScale: number;     // 0-12
}

export interface WindDirection {
  degrees: number;           // 0-360
  cardinal: string;          // N, NE, E, etc.
}

export interface PressureData {
  value: number;             // hPa
  trend: 'rising' | 'falling' | 'steady';
}

export interface VisibilityData {
  value: number;              // km
  category: 'excellent' | 'good' | 'moderate' | 'poor';
}

export interface UVData {
  index: number;              // 0-11+
  category: UVCategory;
  recommendation: string;
}

export type UVCategory = 'low' | 'moderate' | 'high' | 'very-high' | 'extreme';

export interface PrecipitationData {
  probability: number;        // 0-100%
  amount: number;            // mm
  type: 'none' | 'rain' | 'sleet' | 'snow' | 'hail';
}

export interface WeatherCondition {
  code: WeatherCode;         // WMO weather code
  description: LocalizedString;
  icon: string;               // Icon identifier
  isNight: boolean;
}

// WMO Weather Codes (0-99)
export type WeatherCode = 
  | 0   // Clear sky
  | 1   // Mainly clear
  | 2   // Partly cloudy
  | 3   // Overcast
  | 45  // Fog
  | 48  // Depositing rime fog
  | 51  // Drizzle: Light
  | 53  // Drizzle: Moderate
  | 55  // Drizzle: Dense
  | 56  // Freezing Drizzle: Light
  | 57  // Freezing Drizzle: Dense
  | 61  // Rain: Slight
  | 63  // Rain: Moderate
  | 65  // Rain: Heavy
  | 66  // Freezing Rain: Light
  | 67  // Freezing Rain: Heavy
  | 71  // Snow fall: Slight
  | 73  // Snow fall: Moderate
  | 75  // Snow fall: Heavy
  | 77  // Snow grains
  | 80  // Rain showers: Slight
  | 81  // Rain showers: Moderate
  | 82  // Rain showers: Violent
  | 85  // Snow showers: Slight
  | 86  // Snow showers: Moderate
  | 95  // Thunderstorm
  | 96  // Thunderstorm with slight hail
  | 99; // Thunderstorm with heavy hail

export interface SunData {
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
  daylight: Duration;        // Daylight duration
}

export interface Duration {
  hours: number;
  minutes: number;
}

/** Hourly forecast data */
export interface HourlyForecast {
  location: LocationReference;
  hours: HourlyData[];
  generatedAt: Date;
  expiresAt: Date;
}

export interface HourlyData {
  timestamp: Date;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  precipitationProbability: number;
  precipitationAmount: number;
  weatherCode: WeatherCode;
  visibility: number;
  isDay: boolean;
}

/** 7-day daily forecast */
export interface DailyForecast {
  location: LocationReference;
  days: DailyData[];
  generatedAt: Date;
  expiresAt: Date;
}

export interface DailyData {
  date: Date;
  tempMax: number;
  tempMin: number;
  feelsLikeMax: number;
  feelsLikeMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  weatherCode: WeatherCode;
  sunrise: Date;
  sunset: Date;
  uvIndexMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirection: number;
}