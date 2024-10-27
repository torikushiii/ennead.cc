// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://ennead.cc',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false
    }),
    sitemap(),
    mdx(),
    cloudflare()
  ],
  output: 'server',
  adapter: cloudflare()
});
