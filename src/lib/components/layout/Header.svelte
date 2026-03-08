<script lang="ts">
  import { t } from '$lib/i18n';
  import { themeStore } from '$lib/stores/theme.store';
  import { navigation } from '$app/stores';
  import { Sun, Moon, Menu } from 'lucide-svelte';
</script>

<header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div class="container mx-auto px-4 h-16 flex items-center justify-between">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 font-bold text-xl">
      <span>🌡️</span>
      <span>Südtirol Wetter</span>
    </a>
    
    <!-- Navigation -->
    <nav class="hidden md:flex items-center gap-6">
      <a href="/forecast" class="text-sm font-medium hover:text-primary transition-colors">
        {t('common.forecast', 'Vorhersage')}
      </a>
      <a href="/radar" class="text-sm font-medium hover:text-primary transition-colors">
        {t('common.radar', 'Radar')}
      </a>
      <a href="/mountain" class="text-sm font-medium hover:text-primary transition-colors">
        {t('common.mountain', 'Bergwetter')}
      </a>
    </nav>
    
    <!-- Actions -->
    <div class="flex items-center gap-2">
      <!-- Language selector would go here -->
      
      <!-- Theme toggle -->
      <button
        on:click={() => themeStore.toggleTheme()}
        class="p-2 rounded-md hover:bg-muted transition-colors"
        title="Theme umschalten"
      >
        {#if $themeStore.isDark}
          <Moon class="w-5 h-5" />
        {:else}
          <Sun class="w-5 h-5" />
        {/if}
      </button>
      
      <!-- Mobile menu button -->
      <button class="md:hidden p-2 rounded-md hover:bg-muted">
        <Menu class="w-5 h-5" />
      </button>
    </div>
  </div>
</header>
