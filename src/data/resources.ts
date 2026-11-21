// Articles and guides under /resources/, newest first. Each one is a page in
// src/pages/resources/ using the Article layout; this list feeds the Resources
// index and the "more to read" links.

export interface Resource {
  href: string;
  kind: 'Guide' | 'Article';
  title: string;
  blurb: string;
  /** ISO date. */
  published: string;
  minutes: number;
  /** Card picture, 16:9-ish, in public/. */
  image: string;
  imageAlt: string;
}

export const resources: Resource[] = [
  {
    href: '/resources/digital-twin/',
    kind: 'Guide',
    title: 'Your production line, alive in a browser tab',
    blurb:
      'What a digital twin really is on the factory floor, and how to build one in Nexus: a PET bottling line, from the first tag to the screen everyone keeps open.',
    published: '2026-11-20',
    minutes: 7,
    image: '/resources/digital-twin-card.jpg',
    imageAlt: 'The Line 1 bottling twin in Nexus, with the drawing of the line, its scorecard and the selected-machine panel',
  },
];

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
