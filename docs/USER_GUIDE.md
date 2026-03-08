# User Guide

Welcome to the **Südtirol Wetter App V2**! This guide will help you get the most out of your weather application for South Tyrol.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Features Overview](#features-overview)
3. [Location Management](#location-management)
4. [Weather Data Explained](#weather-data-explained)
5. [Settings & Preferences](#settings--preferences)
6. [PWA Installation](#pwa-installation)
7. [Offline Mode](#offline-mode)
8. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Launch

1. **Allow Location Access**: When prompted, allow the app to access your location for accurate local weather.
2. **Select Language**: Choose your preferred language (German, Italian, English, or Ladin).
3. **Choose Theme**: Select light, dark, or OLED theme.

### Quick Tour

The main screen shows:
- **Current Weather**: Temperature, conditions, and feels-like temperature
- **Hourly Forecast**: Scrollable 48-hour preview
- **7-Day Forecast**: Weekly outlook with high/low temperatures

---

## Features Overview

### 🌤️ Current Weather

The main display shows:
- **Temperature**: Current temperature in °C (or °F)
- **Feels Like**: How temperature actually feels
- **Humidity**: Relative humidity percentage
- **Wind**: Speed and direction
- **UV Index**: Sun protection recommendations
- **Visibility**: Current visibility conditions
- **Pressure**: Atmospheric pressure with trend

### 📅 Forecasts

#### Hourly Forecast
- Shows next 48 hours
- Scroll horizontally to see more
- Displays: temperature, precipitation probability, weather icon

#### Daily Forecast
- Shows 7-day outlook
- Displays: date, high/low temps, precipitation chance, weather condition

### 🔍 Location Search

1. Tap the search icon in the header
2. Enter a city name (e.g., "Bolzano", "Merano", "Brixen")
3. Select from the results
4. Weather updates automatically

### ⭐ Favorites

Save your favorite locations for quick access:
1. Search for a location
2. Tap the star icon to add to favorites
3. Access favorites from the location selector

---

## Location Management

### Automatic Location

The app uses your device's GPS to get accurate local weather:
- Tap "Use My Location" to enable
- Requires location permission
- Works best outdoors with clear sky view

### Manual Location

Search for any location in South Tyrol:
- **Cities**: Bolzano, Merano, Brixen, Trento, etc.
- **Towns**: Appiano, Egna, Ora, Laives, etc.
- **Mountain Areas**: Val Gardena, Val di Funes, etc.

### Location List

Common South Tyrol locations are pre-loaded:
- Bolzano (Bozen)
- Merano (Meran)
- Brixen (Bressanone)
- Trento
- Brunico (Bruneck)
- Appiano (Eppan)
- Egna (Neumarkt)
- Ora (Auer)
- Laives (Leifers)
- Val Gardena (Gröden)
- Val di Funes (Villnöß)
- Alta Badia

---

## Weather Data Explained

### Weather Codes

The app uses WMO (World Meteorological Organization) weather codes:

| Code | Description | Icon |
|------|-------------|------|
| 0 | Clear sky | ☀️ |
| 1 | Mainly clear | 🌤️ |
| 2 | Partly cloudy | ⛅ |
| 3 | Overcast | ☁️ |
| 45 | Fog | 🌫️ |
| 51-57 | Drizzle | 🌧️ |
| 61-67 | Rain | 🌧️ |
| 71-77 | Snow | 🌨️ |
| 80-82 | Rain showers | 🌦️ |
| 95-99 | Thunderstorm | ⛈️ |

### UV Index

| Index | Category | Recommendation |
|-------|----------|----------------|
| 0-2 | Low | Safe outdoor activity |
| 3-5 | Moderate | Shade at midday |
| 6-7 | High | Reduce sun exposure |
| 8-10 | Very High | Limit midday exposure |
| 11+ | Extreme | Avoid sun exposure |

### Wind Speed (Beaufort Scale)

| Beaufort | Description | km/h |
|----------|-------------|------|
| 0 | Calm | < 1 |
| 1 | Light air | 1-5 |
| 2 | Light breeze | 6-11 |
| 3 | Gentle breeze | 12-19 |
| 4 | Moderate breeze | 20-28 |
| 5 | Fresh breeze | 29-38 |
| 6 | Strong breeze | 39-49 |
| 7+ | High wind | 50+ |

---

## Settings & Preferences

### Language

Change the app language:
- 🇩🇪 **German** (Deutsch)
- 🇮🇹 **Italian** (Italiano)
- 🇬🇧 **English**
- 🇱🇻 **Ladin** (Ladin)

### Theme

Choose your visual theme:
- ☀️ **Light**: Classic white background
- 🌙 **Dark**: Easy on the eyes at night
- ⚫ **OLED**: True black for OLED screens (saves battery)

### Temperature Unit

- Celsius (°C) - Default
- Fahrenheit (°F)

### Data & Storage

- **Auto-refresh**: Weather updates automatically
- **Cache**: Old data stored for offline access
- **Clear Cache**: Remove cached data in settings

---

## PWA Installation

### On Mobile (iOS)

1. Open the app in Safari
2. Tap the **Share** button (⬆️)
3. Tap **Add to Home Screen**
4. Tap **Add**
5. App icon appears on your home screen

### On Mobile (Android)

1. Open the app in Chrome
2. Tap the **Menu** (⋮)
3. Tap **Install App** or **Add to Home Screen**
4. Follow the prompts
5. App icon appears in your app drawer

### On Desktop

**Chrome/Edge**:
1. Click the install icon in the address bar
2. Click **Install**

**Firefox**:
1. Click the menu (≡)
2. Click **Install**

---

## Offline Mode

### How It Works

The app automatically caches weather data:
- Last viewed location's weather is saved
- App works without internet connection
- Shows "Last updated" timestamp when offline

### Limitations

When offline:
- Cannot search new locations
- Cannot get latest data
- Some features may be limited

### Best Practices

1. **View weather before going offline** - Data is cached
2. **Keep location favorites** - Pre-saved locations work offline
3. **Check timestamp** - Always verify data freshness

---

## Troubleshooting

### Location Not Working

**Problem**: App can't find my location

**Solutions**:
1. Enable GPS/location services on your device
2. Allow location permission for the app
3. Try again outdoors with clear sky view
4. Use manual search as alternative

### Weather Data Not Loading

**Problem**: App shows error or no data

**Solutions**:
1. Check your internet connection
2. Refresh the page
3. Try a different location
4. Clear app cache

### App Not Installing

**Problem**: Can't install PWA

**Solutions**:
1. Use Chrome or Safari (recommended browsers)
2. Ensure you're visiting the HTTPS version
3. Check device compatibility
4. Try desktop Chrome for computer install

### Language Not Changing

**Problem**: Language stays the same

**Solutions**:
1. Close and reopen the app
2. Clear browser cache
3. Check system language settings

### Dark Mode Not Working

**Problem**: Theme doesn't change

**Solutions**:
1. Toggle theme off and on
2. Check system theme settings
3. Clear localStorage
4. Update your browser

---

## Tips & Tricks

### Quick Actions

- **Pull to refresh**: Get latest weather data
- **Swipe hourly forecast**: See more hours
- **Tap day**: View detailed daily forecast

### Mountain Activities

For mountain hiking/visitors:
- Check **wind speed** for exposed areas
- Monitor **UV index** at high altitudes
- Watch for **precipitation** changes

### Best Times to Check

- **Morning** (6-8 AM): Start of day forecast
- **Midday** (11 AM-1 PM): UV peak, best solar
- **Evening** (5-7 PM): Plan evening activities

---

## Data Sources

Weather data provided by:
- **Open-Meteo API** (https://open-meteo.com/)
- Meteorological data from national agencies
- Updated regularly (typically hourly)

---

## Support

For issues or feedback:
- Open an issue on GitHub
- Check the API documentation
- Review the troubleshooting guide

---

*Enjoy the weather in beautiful South Tyrol! ☀️🌤️🌧️❄️*
