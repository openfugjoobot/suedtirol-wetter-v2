<script lang="ts">
  import { locationStore } from '$lib/stores/location.store';
  import { t } from '$lib/i18n';
  import { Search, MapPin } from 'lucide-svelte';
</script>

<div class="bg-card rounded-xl shadow-lg p-4">
  <h2 class="text-lg font-semibold mb-3 flex items-center gap-2">
    <MapPin class="w-5 h-5" />
    {t('location.select', 'Ort auswählen')}
  </h2>
  
  <div class="relative">
    <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    <input
      type="text"
      placeholder={t('location.search', 'Ort suchen...')}
      class="w-full pl-10 pr-4 py-2 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
    />
  </div>
  
  <div class="mt-4 space-y-2">
    <h3 class="text-sm font-medium text-muted-foreground">{t('location.favorites', 'Favoriten')}</h3>
    <div class="space-y-1">
      {#each $locationStore.favorites as coords}
        <button
          class="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
        >
          {coords.latitude.toFixed(2)}, {coords.longitude.toFixed(2)}
        </button>
      {/each}
    </div>
  </div>
</div>
