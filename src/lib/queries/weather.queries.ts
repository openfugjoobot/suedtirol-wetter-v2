/**
 * TanStack Query definitions for weather data
 */

import { createQuery, createQueries } from '@tanstack/svelte-query';
import type { QueryClient } from '@tanstack/svelte-query';
import type { Coordinates } from '../types/location.types';
import type { CurrentWeather, HourlyForecast, DailyForecast } from '../types/weather.types';

// Types for our query functions
export interface WeatherQueryFunctions {
  getCurrentWeather: (coords: Coordinates) => Promise<CurrentWeather>;
  getHourlyForecast: (coords: Coordinates) => Promise<HourlyForecast>;
  getDailyForecast: (coords: Coordinates) => Promise<DailyForecast>;
  getWeatherData: (coords: Coordinates) => Promise<{
    current: CurrentWeather;
    hourly: HourlyForecast;
    daily: DailyForecast;
  }>;
}

// Query keys for cache management
export const weatherKeys = {
  all: ['weather'] as const,
  current: (coords: Coordinates) => [...weatherKeys.all, 'current', coords.latitude, coords.longitude] as const,
  hourly: (coords: Coordinates) => [...weatherKeys.all, 'hourly', coords.latitude, coords.longitude] as const,
  daily: (coords: Coordinates) => [...weatherKeys.all, 'daily', coords.latitude, coords.longitude] as const,
  bundle: (coords: Coordinates) => [...weatherKeys.all, 'bundle', coords.latitude, coords.longitude] as const,
};

/**
 * Create weather queries with proper caching strategies
 */
export function createWeatherQueries(
  queryClient: QueryClient,
  weatherService: WeatherQueryFunctions
) {
  // Current weather query
  const currentWeatherQuery = (coords: Coordinates) => ({
    queryKey: weatherKeys.current(coords),
    queryFn: () => weatherService.getCurrentWeather(coords),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    refetchOnWindowFocus: true,
    enabled: !!coords,
  });

  // Hourly forecast query
  const hourlyForecastQuery = (coords: Coordinates) => ({
    queryKey: weatherKeys.hourly(coords),
    queryFn: () => weatherService.getHourlyForecast(coords),
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    refetchOnWindowFocus: true,
    enabled: !!coords,
  });

  // Daily forecast query
  const dailyForecastQuery = (coords: Coordinates) => ({
    queryKey: weatherKeys.daily(coords),
    queryFn: () => weatherService.getDailyForecast(coords),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 4 * 60 * 60 * 1000, // 4 hours
    refetchOnWindowFocus: false,
    enabled: !!coords,
  });

  // Combined bundle query for initial load
  const weatherBundleQuery = (coords: Coordinates) => ({
    queryKey: weatherKeys.bundle(coords),
    queryFn: () => weatherService.getWeatherData(coords),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,   // 30 minutes
    refetchOnWindowFocus: true,
    enabled: !!coords,
  });

  return {
    currentWeatherQuery,
    hourlyForecastQuery,
    dailyForecastQuery,
    weatherBundleQuery,
  };
}

/**
 * Hook functions for using weather queries in components
 */
export function useCurrentWeather(coords: Coordinates, weatherService: WeatherQueryFunctions) {
  return createQuery(() => ({
    queryKey: weatherKeys.current(coords),
    queryFn: () => weatherService.getCurrentWeather(coords),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: !!coords,
  }));
}

export function useHourlyForecast(coords: Coordinates, weatherService: WeatherQueryFunctions) {
  return createQuery(() => ({
    queryKey: weatherKeys.hourly(coords),
    queryFn: () => weatherService.getHourlyForecast(coords),
    staleTime: 15 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: !!coords,
  }));
}

export function useDailyForecast(coords: Coordinates, weatherService: WeatherQueryFunctions) {
  return createQuery(() => ({
    queryKey: weatherKeys.daily(coords),
    queryFn: () => weatherService.getDailyForecast(coords),
    staleTime: 30 * 60 * 1000,
    gcTime: 4 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!coords,
  }));
}

export function useWeatherBundle(coords: Coordinates, weatherService: WeatherQueryFunctions) {
  return createQuery(() => ({
    queryKey: weatherKeys.bundle(coords),
    queryFn: () => weatherService.getWeatherData(coords),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: !!coords,
  }));
}

/**
 * Invalidate weather queries for a specific location
 */
export function invalidateWeatherQueries(
  queryClient: QueryClient,
  coords: Coordinates
): Promise<void> {
  return queryClient.invalidateQueries({
    predicate: (query) => {
      const queryKey = query.queryKey;
      return (
        Array.isArray(queryKey) &&
        queryKey[0] === 'weather' &&
        queryKey.includes(coords.latitude) &&
        queryKey.includes(coords.longitude)
      );
    }
  });
}

/**
 * Prefetch weather data for a location
 */
export async function prefetchWeatherData(
  queryClient: QueryClient,
  weatherService: WeatherQueryFunctions,
  coords: Coordinates
): Promise<void> {
  // Prefetch all weather data for the location
  await Promise.allSettled([
    queryClient.prefetchQuery({
      queryKey: weatherKeys.current(coords),
      queryFn: () => weatherService.getCurrentWeather(coords),
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: weatherKeys.hourly(coords),
      queryFn: () => weatherService.getHourlyForecast(coords),
      staleTime: 15 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: weatherKeys.daily(coords),
      queryFn: () => weatherService.getDailyForecast(coords),
      staleTime: 30 * 60 * 1000,
    })
  ]);
}