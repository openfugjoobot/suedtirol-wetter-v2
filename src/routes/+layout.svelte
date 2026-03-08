<script lang="ts">
  import { navigate } from 'sveltekit-i18n';
  import { locale } from 'sveltekit-i18n';
  
  // Import components
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
</script>

<Header />

<main class="min-h-screen bg-background text-foreground">
  <slot />
</main>

<Footer />
