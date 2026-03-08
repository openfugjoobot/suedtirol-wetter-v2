/**
 * Unit tests for utility functions
 */

import { describe, it, expect } from 'vitest';

describe('Weather Utilities', () => {
  describe('temperature conversion', () => {
    it('should convert Celsius to Fahrenheit', () => {
      const celsiusToFahrenheit = (c: number) => (c * 9/5) + 32;
      
      expect(celsiusToFahrenheit(0)).toBe(32);
      expect(celsiusToFahrenheit(10)).toBe(50);
      expect(celsiusToFahrenheit(20)).toBe(68);
      expect(celsiusToFahrenheit(30)).toBe(86);
      expect(celsiusToFahrenheit(-10)).toBe(14);
    });

    it('should convert Fahrenheit to Celsius', () => {
      const fahrenheitToCelsius = (f: number) => (f - 32) * 5/9;
      
      expect(fahrenheitToCelsius(32)).toBe(0);
      expect(fahrenheitToCelsius(50)).toBeCloseTo(10, 5);
      expect(fahrenheitToCelsius(68)).toBeCloseTo(20, 5);
      expect(fahrenheitToCelsius(86)).toBeCloseTo(30, 5);
    });
  });

  describe('wind direction', () => {
    const degreesToCardinal = (degrees: number): string => {
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const index = Math.round(degrees / 22.5) % 16;
      return directions[index];
    };

    it('should convert degrees to cardinal directions', () => {
      expect(degreesToCardinal(0)).toBe('N');
      expect(degreesToCardinal(45)).toBe('NE');
      expect(degreesToCardinal(90)).toBe('E');
      expect(degreesToCardinal(135)).toBe('SE');
      expect(degreesToCardinal(180)).toBe('S');
      expect(degreesToCardinal(225)).toBe('SW');
      expect(degreesToCardinal(270)).toBe('W');
      expect(degreesToCardinal(315)).toBe('NW');
    });

    it('should handle edge cases', () => {
      expect(degreesToCardinal(360)).toBe('N');
      expect(degreesToCardinal(720)).toBe('N');
      expect(degreesToCardinal(22.5)).toBe('NNE');
    });
  });

  describe('Beaufort scale', () => {
    const beaufortScale = (windSpeedKmh: number): number => {
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
    };

    it('should convert wind speed to Beaufort scale', () => {
      expect(beaufortScale(0)).toBe(0);    // Calm
      expect(beaufortScale(3)).toBe(1);    // Light air
      expect(beaufortScale(10)).toBe(2);   // Light breeze
      expect(beaufortScale(15)).toBe(3);   // Gentle breeze
      expect(beaufortScale(25)).toBe(4);   // Moderate breeze
      expect(beaufortScale(50)).toBe(7);   // High wind
      expect(beaufortScale(100)).toBe(10); // Storm
      expect(beaufortScale(150)).toBe(12); // Hurricane
    });

    it('should return values between 0 and 12', () => {
      for (let speed = 0; speed <= 200; speed += 10) {
        const beaufort = beaufortScale(speed);
        expect(beaufort).toBeGreaterThanOrEqual(0);
        expect(beaufort).toBeLessThanOrEqual(12);
      }
    });
  });

  describe('dew point calculation', () => {
    const calculateDewPoint = (temperature: number, humidity: number): number => {
      const a = 17.27;
      const b = 237.7;
      const alpha = ((a * temperature) / (b + temperature)) + Math.log(humidity / 100);
      return (b * alpha) / (a - alpha);
    };

    it('should calculate dew point correctly', () => {
      // At 100% humidity, dew point equals temperature
      expect(calculateDewPoint(20, 100)).toBeCloseTo(20, 1);
      
      // At lower humidity, dew point is lower than temperature
      const dewPoint20_60 = calculateDewPoint(20, 60);
      expect(dewPoint20_60).toBeLessThan(20);
      expect(dewPoint20_60).toBeGreaterThan(10);
    });

    it('should handle edge cases', () => {
      expect(calculateDewPoint(0, 50)).toBeLessThan(0);
      expect(calculateDewPoint(30, 90)).toBeCloseTo(28, 0);
    });
  });

  describe('pressure trend', () => {
    const determinePressureTrend = (pressure: number): 'rising' | 'falling' | 'steady' => {
      if (pressure < 980) return 'falling';
      if (pressure > 1030) return 'rising';
      return 'steady';
    };

    it('should determine pressure trend', () => {
      expect(determinePressureTrend(970)).toBe('falling');
      expect(determinePressureTrend(1000)).toBe('steady');
      expect(determinePressureTrend(1040)).toBe('rising');
    });
  });

  describe('visibility category', () => {
    const getVisibilityCategory = (km: number): 'excellent' | 'good' | 'moderate' | 'poor' => {
      if (km >= 10) return 'excellent';
      if (km >= 5) return 'good';
      if (km >= 2) return 'moderate';
      return 'poor';
    };

    it('should categorize visibility', () => {
      expect(getVisibilityCategory(15)).toBe('excellent');
      expect(getVisibilityCategory(10)).toBe('excellent');
      expect(getVisibilityCategory(7)).toBe('good');
      expect(getVisibilityCategory(5)).toBe('good');
      expect(getVisibilityCategory(3)).toBe('moderate');
      expect(getVisibilityCategory(2)).toBe('moderate');
      expect(getVisibilityCategory(1)).toBe('poor');
    });
  });

  describe('UV index category', () => {
    const getUVCategory = (index: number): 'low' | 'moderate' | 'high' | 'very-high' | 'extreme' => {
      if (index <= 2) return 'low';
      if (index <= 5) return 'moderate';
      if (index <= 7) return 'high';
      if (index <= 10) return 'very-high';
      return 'extreme';
    };

    it('should categorize UV index', () => {
      expect(getUVCategory(0)).toBe('low');
      expect(getUVCategory(2)).toBe('low');
      expect(getUVCategory(3)).toBe('moderate');
      expect(getUVCategory(5)).toBe('moderate');
      expect(getUVCategory(6)).toBe('high');
      expect(getUVCategory(7)).toBe('high');
      expect(getUVCategory(8)).toBe('very-high');
      expect(getUVCategory(10)).toBe('very-high');
      expect(getUVCategory(11)).toBe('extreme');
      expect(getUVCategory(12)).toBe('extreme');
    });
  });

  describe('precipitation type', () => {
    const getPrecipitationType = (weatherCode: number, temperature: number): 'none' | 'rain' | 'sleet' | 'snow' | 'hail' => {
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
    };

    it('should determine precipitation type from weather code', () => {
      expect(getPrecipitationType(0, 15)).toBe('none');  // Clear
      expect(getPrecipitationType(51, 15)).toBe('rain'); // Drizzle above freezing
      expect(getPrecipitationType(51, -5)).toBe('sleet'); // Drizzle below freezing
      expect(getPrecipitationType(71, 15)).toBe('snow'); // Snow
      expect(getPrecipitationType(80, 20)).toBe('rain'); // Showers
    });
  });
});

describe('Date Utilities', () => {
  describe('time formatting', () => {
    const formatTime = (date: Date, format: '24h' | '12h' = '24h'): string => {
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      if (format === '12h') {
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes} ${period}`;
      }
      
      return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    it('should format time in 24h format', () => {
      const date = new Date('2026-03-08T14:30:00Z');
      expect(formatTime(date, '24h')).toBe('14:30');
      expect(formatTime(new Date('2026-03-08T09:05:00Z'), '24h')).toBe('09:05');
    });

    it('should format time in 12h format', () => {
      expect(formatTime(new Date('2026-03-08T14:30:00Z'), '12h')).toBe('2:30 PM');
      expect(formatTime(new Date('2026-03-08T09:05:00Z'), '12h')).toBe('9:05 AM');
      expect(formatTime(new Date('2026-03-08T00:00:00Z'), '12h')).toBe('12:00 AM');
    });
  });

  describe('daylight duration', () => {
    const calculateDaylightDuration = (sunrise: Date, sunset: Date): { hours: number; minutes: number } => {
      const diff = sunset.getTime() - sunrise.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes };
    };

    it('should calculate daylight duration', () => {
      const sunrise = new Date('2026-03-08T06:30:00Z');
      const sunset = new Date('2026-03-08T18:30:00Z');
      
      const duration = calculateDaylightDuration(sunrise, sunset);
      expect(duration.hours).toBe(12);
      expect(duration.minutes).toBe(0);
    });

    it('should handle partial hours', () => {
      const sunrise = new Date('2026-03-08T06:15:00Z');
      const sunset = new Date('2026-03-08T19:45:00Z');
      
      const duration = calculateDaylightDuration(sunrise, sunset);
      expect(duration.hours).toBe(13);
      expect(duration.minutes).toBe(30);
    });
  });
});

describe('Distance Calculation', () => {
  const calculateDistance = (
    coord1: { latitude: number; longitude: number },
    coord2: { latitude: number; longitude: number }
  ): number => {
    const R = 6371; // Earth radius in km
    const dLat = toRadians(coord2.latitude - coord1.latitude);
    const dLon = toRadians(coord2.longitude - coord1.longitude);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(coord1.latitude)) * 
      Math.cos(toRadians(coord2.latitude)) * 
      Math.sin(dLon / 2) * 
      Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  it('should calculate distance between two points', () => {
    // Bozen to Meran (approximately 30 km)
    const bozen = { latitude: 46.4983, longitude: 11.3548 };
    const meran = { latitude: 46.6682, longitude: 11.1597 };
    
    const distance = calculateDistance(bozen, meran);
    expect(distance).toBeGreaterThanOrEqual(25);
    expect(distance).toBeLessThanOrEqual(35);
  });

  it('should return 0 for same coordinates', () => {
    const coord = { latitude: 46.4983, longitude: 11.3548 };
    expect(calculateDistance(coord, coord)).toBe(0);
  });

  it('should be symmetric', () => {
    const coord1 = { latitude: 46.4983, longitude: 11.3548 };
    const coord2 = { latitude: 46.6682, longitude: 11.1597 };
    
    const dist1to2 = calculateDistance(coord1, coord2);
    const dist2to1 = calculateDistance(coord2, coord1);
    
    expect(dist1to2).toBeCloseTo(dist2to1, 5);
  });
});
