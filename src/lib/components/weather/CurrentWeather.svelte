<script lang="ts">
  import { weatherStore } from '$lib/stores/weather.store';
  import { themeStore } from '$lib/stores/theme.store';
  import { t } from '$lib/i18n';
  
  // Icons
  import { Sun, Moon, Wind, Droplets, Thermometer, Gauge, Eye, SunIcon, Cloud } from 'lucide-svelte';
</script>

{#await $weatherStore}
  <div class="w-full">
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-skeleton rounded"></div>
      <div class="h-32 bg-skeleton rounded"></div>
    </div>
  </div>
{:then store}
  {#if store.current}
    <div class="bg-card rounded-xl shadow-lg overflow-hidden">
      <div class="p-6">
        <h2 class="text-2xl font-semibold mb-4 flex items-center gap-2">
          {t('weather.current.title', 'Aktuelles Wetter')}
        </h2>
        
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex flex-col items-center md:items-start">
            <div class="text-8xl font-bold tracking-tighter">
              {store.current.temperature.current.toFixed(0)}°
            </div>
            <p class="text-lg text-muted-foreground mt-2">
              {t('weather.current.feelsLike', 'Gefühlt')} {store.current.feelsLike.toFixed(0)}°
            </p>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="text-center">
              <p class="text-sm text-muted-foreground mb-1"> {store.current.condition.description.de}</p>
              <p class="text-xs text-muted-foreground">{store.current.timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div class="flex items-center gap-2">
            <Droplets class="w-5 h-5 text-muted-foreground" />
            <div>
              <p class="text-xs text-muted-foreground">{t('weather.current.humidity', 'Luftfeuchtigkeit')}</p>
              <p class="font-medium">{store.current.humidity.relative}%</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <Wind class="w-5 h-5 text-muted-foreground" />
            <div>
              <p class="text-xs text-muted-foreground">{t('weather.current.wind', 'Wind')}</p>
              <p class="font-medium">
                {store.current.wind.speed.toFixed(0)} {t('weather.units.kmh', 'km/h')} {store.current.wind.direction.cardinal}
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <Gauge class="w-5 h-5 text-muted-foreground" />
            <div>
              <p class="text-xs text-muted-foreground">{t('weather.current.pressure', 'Luftdruck')}</p>
              <p class="font-medium">{store.current.pressure.value} hPa</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <Eye class="w-5 h-5 text-muted-foreground" />
            <div>
              <p class="text-xs text-muted-foreground">{t('weather.current.visibility', 'Sichtweite')}</p>
              <p class="font-medium">{store.current.visibility.value} km</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
{/await}
