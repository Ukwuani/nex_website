import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// The user documentation: one Markdown file per topic in src/content/docs/.
// Where each page sits in the sidebar is set in src/data/docs.ts.
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    /** One sentence: the page's lead and its line on the docs home, and its meta description unless it has a summary. */
    description: z.string(),
    /** The meta description for search results, when the description is longer than 160 characters. */
    summary: z.string().max(160).optional(),
  }),
});

export const collections = { docs };
