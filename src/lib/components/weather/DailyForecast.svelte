<script lang="ts">
  import { weatherStore } from '$lib/stores/weather.store';
  import { t } from '$lib/i18n';
  import { Sun, Moon } from 'lucide-svelte';
</script>

{#await $weatherStore}
  <div class="w-full">
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-skeleton rounded"></div>
      <div class="h-24 bg-skeleton rounded"></div>
    </div>
  </div>
{:then store}
  {#if store.daily}
    <div class="bg-card rounded-xl shadow-lg overflow-hidden">
      <div class="p-4 border-b">
        <h2 class="text-xl font-semibold">{t('weather._forecast.daily', 'Tage')}</h2>
      </div>
      
      <div>
        {#each store.daily.days as day (day.date.getTime())}
          <div class="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
            <div class="w-24">
              <span class="font-medium">
                {day.date.toLocaleDateString('de-DE', { weekday: 'long' })}
              </span>
            </div>
            
            <div class="flex items-center gap-2">
              <Sun class="w-5 h-5 text-yellow-500" />
              {day.tempMax.toFixed(0)}°
            </div>
            
            <div class="flex items-center gap-2">
              <Moon class="w-5 h-5 text-blue-500" />
              {day.tempMin.toFixed(0)}°
            </div>
            
            <div class="text-sm text-muted-foreground">
              {t('weather.conditions.' + day.weatherCode, 'N/A')}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
{/await}
