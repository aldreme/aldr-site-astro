// @ts-check
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.aldreme.com',

  // https://docs.astro.build/en/guides/prefetch/
  // add data-astro-prefetch attribute to <a /> links
  prefetch: true,

  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh", "fr", "es", "ar"],
    routing: {
      prefixDefaultLocale: false
    }
  },

  integrations: [
    react(),
    sitemap(),
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
      },
      remarkRehype: { footnoteLabel: 'Footnotes' },
      gfm: false,
    })],

  vite: {
    plugins: [tailwindcss()],
  },
});