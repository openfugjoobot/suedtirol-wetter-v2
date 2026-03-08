# API Documentation

This document provides detailed information about the Südtirol Wetter App V2 API integration and internal APIs.

## Table of Contents

1. [External APIs](#external-apis)
2. [Internal API Clients](#internal-api-clients)
3. [Weather Service](#weather-service)
4. [Location Service](#location-service)
5. [Types & Interfaces](#types--interfaces)
6. [Error Handling](#error-handling)

---

## External APIs

### Open-Meteo API

The app uses the free [Open-Meteo API](https://open-meteo.com/) for weather data.

**Base URL**: `https://api.open-meteo.com/v1`

**Features Used**:
- Current weather conditions
- Hourly forecast (48 hours)
- Daily forecast (7 days)
- Geocoding for location search

**Rate Limits**: No API key required. Fair use policy applies (reasonable request rates).

### Geocoding API

**Base URL**: `https://geocoding-api.open-meteo.com/v1`

**Endpoints**:
- `/search` - Search locations by name
- Reverse geocoding support

---

## Internal API Clients

### OpenMeteoClient

Main client for interacting with the Open-Meteo API.

```typescript
import { OpenMeteoClient } from '$lib/api/open-meteo.client';

const client = new OpenMeteoClient();
```

#### Methods

##### getCurrentWeather(coords, options)

Get current weather conditions for specific coordinates.

```typescript
const weather = await client.getCurrentWeather(
  { latitude: 46.4983, longitude: 11.3548 },
  { timezone: 'Europe/Rome' }
);
```

**Parameters**:
| Name | Type | Description |
|------|------|-------------|
| coords | `Coordinates` | Latitude and longitude |
| options | `object` | Optional configuration |

**Options**:
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| temperature_unit | `'celsius' \| 'fahrenheit'` | `'celsius'` | Temperature unit |
| wind_speed_unit | `'kmh' \| 'ms' \| 'mph' \| 'kn'` | `'kmh'` | Wind speed unit |
| timeformat | `'iso8601' \| 'unixtime'` | `'iso8601'` | Time format |
| timezone | `string` | `'auto'` | Timezone for data |

##### getHourlyForecast(coords, options)

Get hourly forecast data.

```typescript
const hourly = await client.getHourlyForecast(
  { latitude: 46.4983, longitude: 11.3548 },
  { forecast_hours: 48 }
);
```

**Options**:
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| forecast_hours | `number` | `48` | Hours to forecast (max 168) |
| temperature_unit | `'celsius' \| 'fahrenheit'` | `'celsius'` | Temperature unit |
| wind_speed_unit | `'kmh' \| 'ms' \| 'mph' \| 'kn'` | `'kmh'` | Wind speed unit |
| timezone | `string` | `'auto'` | Timezone for data |

##### getDailyForecast(coords, options)

Get daily forecast data.

```typescript
const daily = await client.getDailyForecast(
  { latitude: 46.4983, longitude: 11.3548 },
  { forecast_days: 7 }
);
```

**Options**:
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| forecast_days | `number` | `7` | Days to forecast (max 16) |
| temperature_unit | `'celsius' \| 'fahrenheit'` | `'celsius'` | Temperature unit |
| wind_speed_unit | `'kmh' \| 'ms' \| 'mph' \| 'kn'` | `'kmh'` | Wind speed unit |
| timezone | `string` | `'auto'` | Timezone for data |

##### getWeatherBundle(coords, options)

Get all weather data in a single call (current + hourly + daily).

```typescript
const bundle = await client.getWeatherBundle(
  { latitude: 46.4983, longitude: 11.3548 }
);

// Access data
console.log(bundle.current);   // Current weather
console.log(bundle.hourly);    // Hourly forecast
console.log(bundle.daily);     // Daily forecast
```

##### searchLocations(query, options)

Search for locations by name.

```typescript
const results = await client.searchLocations('Bolzano', {
  count: 10,
  language: 'en'
});

results.results?.forEach(location => {
  console.log(location.name);
  console.log(location.latitude, location.longitude);
});
```

**Options**:
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| count | `number` | `10` | Maximum results |
| language | `string` | `'en'` | Response language |
| format | `'json' \| 'jsonf'` | `'json'` | Response format |

---

## Weather Service

The weather service provides a higher-level abstraction over the API client.

```typescript
import { weatherService } from '$lib/services/weather.service';

// Get weather for location
const weather = await weatherService.getWeatherForLocation(coords);

// Get weather by city name
const weatherByCity = await weatherService.getWeatherByCity('Bolzano');

// Refresh weather data
const refreshed = await weatherService.refreshWeather();
```

### Methods

| Method | Description |
|--------|-------------|
| `getWeatherForLocation(coords)` | Get weather for coordinates |
| `getWeatherByCity(cityName)` | Get weather by city name |
| `refreshWeather()` | Refresh current weather data |
| `getCachedWeather()` | Get cached weather data |

---

## Location Service

Manages location detection and favorites.

```typescript
import { locationService } from '$lib/services/location.service';

// Get current location
const current = await locationService.getCurrentLocation();

// Search locations
const results = await locationService.search('Bolzano');

// Add to favorites
await locationService.addFavorite(location);

// Remove from favorites
await locationService.removeFavorite(id);
```

### Methods

| Method | Description |
|--------|-------------|
| `getCurrentLocation()` | Get browser geolocation |
| `search(query)` | Search locations by name |
| `addFavorite(location)` | Add location to favorites |
| `removeFavorite(id)` | Remove location from favorites |
| `getFavorites()` | Get all favorites |

---

## Types & Interfaces

### Weather Types

See `src/lib/types/weather.types.ts` for complete type definitions.

```typescript
// Main weather interfaces
interface CurrentWeather {
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

interface HourlyForecast {
  location: LocationReference;
  hours: HourlyData[];
  generatedAt: Date;
  expiresAt: Date;
}

interface DailyForecast {
  location: LocationReference;
  days: DailyData[];
  generatedAt: Date;
  expiresAt: Date;
}
```

### Location Types

See `src/lib/types/location.types.ts` for complete type definitions.

```typescript
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationReference {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string; // Region/State
  timezone: string;
}
```

### API Response Types

See `src/lib/types/api.types.ts` for complete type definitions.

```typescript
interface OpenMeteoCurrentResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    // ... more fields
  };
  daily: {
    // ... daily data arrays
  };
}
```

---

## Error Handling

### Error Types

The app defines custom error types in `src/lib/types/errors.types.ts`:

```typescript
// Network errors
class NetworkError extends Error {
  status?: number;
  code?: string;
}

// API errors
class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;
}

// Location errors
class LocationError extends Error {
  code: 'PERMISSION_DENIED' | 'POSITION_UNAVAILABLE' | 'TIMEOUT';
}
```

### Error Handling Pattern

```typescript
import { errorHandler } from '$lib/services/error-handler.service';

try {
  const weather = await weatherService.getWeatherForLocation(coords);
} catch (error) {
  const handled = errorHandler.handle(error);
  
  if (handled.type === 'network') {
    // Show offline message
  } else if (handled.type === 'api') {
    // Show API error
  } else if (handled.type === 'location') {
    // Handle location error
  }
}
```

### Offline Support

The app includes offline support via service worker:

- Weather data is cached locally
- App works offline with cached data
- Automatic sync when back online

---

## Example: Building a Weather Widget

Here's how to build a custom weather widget using the existing services:

```svelte
<script lang="ts">
  import { weatherService } from '$lib/services/weather.service';
  import type { CurrentWeather } from '$lib/types/weather.types';

  let weather: CurrentWeather | null = $state(null);
  let loading = $state(true);
  let error: string | null = $state(null);

  async function loadWeather() {
    loading = true;
    error = null;
    
    try {
      weather = await weatherService.getWeatherForLocation({
        latitude: 46.4983,
        longitude: 11.3548
      });
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load weather';
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    loadWeather();
  });
</script>

{#if loading}
  <p>Loading...</p>
{:else if error}
  <p class="error">{error}</p>
{:else if weather}
  <div class="weather-widget">
    <h2>{weather.location.name}</h2>
    <p class="temperature">{weather.temperature.current}°C</p>
    <p class="condition">{weather.condition.description.en}</p>
  </div>
{/if}
```

---

## Rate Limiting Best Practices

When using the API in your own applications:

1. **Cache responses**: Don't request the same data repeatedly
2. **Batch requests**: Use `getWeatherBundle()` instead of multiple calls
3. **Implement retry logic**: Use exponential backoff for failed requests
4. **Handle offline gracefully**: Cache last known data

```typescript
// Good: Bundle request
const bundle = await client.getWeatherBundle(coords);

// Bad: Multiple separate requests
const current = await client.getCurrentWeather(coords);
const hourly = await client.getHourlyForecast(coords);
const daily = await client.getDailyForecast(coords);
```

---

*For questions or issues, please open a GitHub issue.*
