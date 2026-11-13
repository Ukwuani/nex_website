// The search index the docs' search box loads on first use: every page's
// title, section, headings and plain text, built from the Markdown at build time.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { docsOrder } from '../../data/docs';

// GitHub-style heading ids, as Astro's Markdown makes them.
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-');

const plain = (markdown: string) =>
  markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_>|]/g, ' ')
    .replace(/-{3,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const GET: APIRoute = async () => {
  const entries = await getCollection('docs');
  const order = new Map(docsOrder.map((page, i) => [page.slug, i]));
  const index = entries
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
    .map((entry) => {
      const body = entry.body ?? '';
      const headings = [...body.matchAll(/^#{2,3}\s+(.+)$/gm)].map((m) => {
        const text = m[1]!.replace(/`/g, '').trim();
        return { text, slug: slugify(text) };
      });
      return {
        slug: entry.id,
        title: entry.data.title,
        section: docsOrder.find((page) => page.slug === entry.id)?.section ?? '',
        description: entry.data.description,
        headings,
        text: plain(body),
      };
    });
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json' } });
};
