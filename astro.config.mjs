// @ts-check
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://astro.aldreme.com',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});