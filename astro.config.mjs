// @ts-check
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://aldreme.github.io',
  base: 'aldr-site-astro',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});