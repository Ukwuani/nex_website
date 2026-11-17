import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // The production domain, served by Vercel (airogine.com redirects to www).
  // Canonical URLs, Open Graph tags, structured data, robots.txt and the sitemap
  // are all built from it. SITE_URL and BASE_PATH build for somewhere else, such
  // as a preview under a subfolder, without editing this file.
  site: process.env.SITE_URL || 'https://www.airogine.com',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  markdown: {
    // The docs' code samples: light and dark, following the visitor's setting (see docs.css).
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } },
  },
  integrations: [
    sitemap(),
  ],
});
