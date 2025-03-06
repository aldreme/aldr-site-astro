// @ts-check
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { defineConfig } from 'astro/config';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://astro.aldreme.com',

  // https://docs.astro.build/en/guides/prefetch/
  // add data-astro-prefetch attribute to <a /> links
  prefetch: true,

  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
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
});