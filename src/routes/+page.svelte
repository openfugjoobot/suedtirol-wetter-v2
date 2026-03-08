<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { weatherService } from '$lib/services/weather.service';
  import { weatherStore } from '$lib/stores/weather.store';
  import { locationStore } from '$lib/stores/location.store';
  import { useGeolocation } from '$lib/hooks/use-geolocation';
  
  // Components
  import CurrentWeather from '$lib/components/weather/CurrentWeather.svelte';
  import HourlyForecast from '$lib/components/weather/HourlyForecast.svelte';
  import DailyForecast from '$lib/components/weather/DailyForecast.svelte';
  import LocationSelector from '$lib/components/location/LocationSelector.svelte';
  
  let error: string | null = null;
  let isLoading = true;
  
  const geo = useGeolocation();
  
  onMount(async () => {
    try {
      // Try to get current location
      if (geo.coordinates) {
        const coords = geo.coordinates;
        await weatherStore.loadWeather(coords);
        locationStore.setCurrentLocation(coords);
        isLoading = false;
      } else {
        // Fallback to predefined location (Neumarkt-Egna)
        const fallbackCoords = { latitude: 46.4983, longitude: 11.3548 };
        await weatherStore.loadWeather(fallbackCoords);
        locationStore.setCurrentLocation(fallbackCoords);
        isLoading = false;
      }
    } catch (err) {
      error = 'Failed to load weather data';
      isLoading = false;
      console.error('Error loading weather:', err);
    }
  });
</script>

<div class="min-h-screen bg-background">
  <!-- Loading state -->
  {#if isLoading}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p class="text-muted-foreground">Lade Wetterdaten...</p>
      </div>
    </div>
  {:else if error}
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <p class="text-destructive mb-4">{error}</p>
        <button 
          class="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          on:click|preventDefault={() => window.location.reload()}
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  {:else}
    <div class="container mx-auto px-4 py-8">
      <LocationSelector />
      
      <div class="space-y-6 mt-8">
        <CurrentWeather />
        <HourlyForecast />
        <DailyForecast />
      </div>
    </div>
  {/if}
</div>
