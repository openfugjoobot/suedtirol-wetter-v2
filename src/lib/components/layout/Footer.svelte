<script lang="ts">
  import { t } from '$lib/i18n';
</script>

<footer class="border-t bg-background py-8">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Brand -->
      <div>
        <h3 class="font-bold text-lg mb-2">🌡️ Südtirol Wetter</h3>
        <p class="text-sm text-muted-foreground">
          {t('app.description', 'Wettervorhersage für Südtirol')}
        </p>
      </div>
      
      <!-- Links -->
      <div>
        <h4 class="font-semibold mb-3">{t('common.forecast', 'Vorhersage')}</h4>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li><a href="/forecast" class="hover:text-primary">Stündlich</a></li>
          <li><a href="/forecast" class="hover:text-primary">Täglich</a></li>
          <li><a href="/radar" class="hover:text-primary">Radar</a></li>
        </ul>
      </div>
      
      <!-- Links -->
      <div>
        <h4 class="font-semibold mb-3">{t('common.mountain', 'Bergwetter')}</h4>
        <ul class="space-y-2 text-sm text-muted-foreground">
          <li><a href="/mountain" class="hover:text-primary">Alpine Bedingungen</a></li>
          <li><a href="/mountain" class="hover:text-primary">Lawinenlage</a></li>
          <li><a href="/settings" class="hover:text-primary">{t('common.settings', 'Einstellungen')}</a></li>
        </ul>
      </div>
    </div>
    
    <div class="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
      <p>© 2026 Südtirol Wetter App V2. Daten von Open-Meteo.</p>
    </div>
  </div>
</footer>
