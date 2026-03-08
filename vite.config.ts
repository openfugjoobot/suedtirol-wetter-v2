import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  build: {
    target: 'es2020'
  },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.svelte', 'tests/**/*.test.ts'],
    globals: true,
    environment: 'jsdom'
  }
});
