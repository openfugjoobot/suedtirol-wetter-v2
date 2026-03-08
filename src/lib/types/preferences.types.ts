/** User preferences persisted in localStorage */
export interface UserPreferences {
  language: SupportedLanguage;
  temperatureUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kmh' | 'ms' | 'mph' | 'kn';
  pressureUnit: 'hPa' | 'mmHg' | 'inHg';
  timeFormat: '24h' | '12h';
  theme: ThemePreference;
  notifications: NotificationSettings;
  locations: LocationPreferences;
  lastUpdated: Date;
}

export type SupportedLanguage = 'de' | 'it' | 'en' | 'ld';

export type ThemePreference = 'light' | 'dark' | 'system' | 'oled';

export interface NotificationSettings {
  severeWeather: boolean;
  severeWeatherLevel: AlertLevel;
  dailyForecast: boolean;
  dailyForecastTime?: string;    // HH:mm format
}

export type AlertLevel = 'moderate' | 'severe' | 'extreme';

export interface LocationPreferences {
  favorites: string[];            // Location IDs
  recent: string[];               // Recently viewed
  defaultLocation: string | 'current';
  useGeolocation: boolean;
}