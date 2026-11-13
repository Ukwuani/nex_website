// The documentation's sidebar, in reading order. Each slug is a Markdown file
// in src/content/docs/ (without .md). A page missing here, or a slug without a
// file, fails the build - see src/pages/docs/[...slug].astro.

export interface DocsSection {
  title: string;
  icon: string;
  pages: string[];
}

export const docsNav: DocsSection[] = [
  { title: 'Getting started', icon: 'rocket', pages: ['introduction', 'installation', 'quick-start', 'the-workspace'] },
  { title: 'Connect and model', icon: 'plug', pages: ['devices', 'tags', 'expressions', 'udt-templates', 'assets'] },
  { title: 'Screens for operators', icon: 'monitor-smartphone', pages: ['views', 'symbol-library', 'applications', 'barcode-scanning'] },
  { title: 'Alarms, history and reports', icon: 'bell-ring', pages: ['alarms', 'notifications-and-on-call', 'trends', 'reports'] },
  { title: 'Automation', icon: 'code-xml', pages: ['scripting', 'script-api', 'node-red', 'ai-assistant'] },
  { title: 'Integration', icon: 'share-2', pages: ['connectivity', 'rest-api', 'gateway-network', 'projects-and-packages'] },
  { title: 'Administration', icon: 'shield-check', pages: ['users-and-roles', 'sign-in-providers', 'system-health', 'redundancy', 'security', 'operations', 'configuration', 'troubleshooting'] },
];

export const docsOrder = docsNav.flatMap((section) => section.pages.map((slug) => ({ slug, section: section.title })));
