<script lang="ts">
  import { weatherStore } from '$lib/stores/weather.store';
  import { t } from '$lib/i18n';
</script>

{#await $weatherStore}
  <div class="w-full">
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-skeleton rounded"></div>
      <div class="h-24 bg-skeleton rounded"></div>
    </div>
  </div>
{:then store}
  {#if store.hourly}
    <div class="bg-card rounded-xl shadow-lg overflow-hidden">
      <div class="p-4 border-b">
        <h2 class="text-xl font-semibold">{t('weather._forecast.hourly', 'Stündlich')}</h2>
      </div>
      
      <div class="overflow-x-auto">
        <div class="flex min-w-[600px]">
          {#each store.hourly.hours as hour (hour.timestamp.getTime())}
            <div class="flex flex-col items-center px-4 py-3 min-w-[80px] border-r last:border-r-0">
              <span class="text-xs text-muted-foreground mb-2">
                {hour.timestamp.toLocaleTimeString('de-DE', { hour: '2-digit' })}
              </span>
              <div class="mb-2">
                <!-- Weather icon would go here -->
                <Cloud class="w-6 h-6 text-muted-foreground" />
              </div>
              <span class="font-semibold">{hour.temperature.toFixed(0)}°</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
{/await}
