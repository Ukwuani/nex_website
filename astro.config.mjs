import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // OPEN: the production domain is not decided yet (see README). Canonical URLs,
  // Open Graph tags, robots.txt and the sitemap are all built from this value.
  // SITE_URL and BASE_PATH let the GitHub Pages workflow build for
  // https://<user>.github.io/<repo>/ without editing this file.
  site: process.env.SITE_URL || 'https://www.example.com',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !['/docs/', '/privacy/'].some((p) => page.endsWith(p)),
    }),
  ],
});
