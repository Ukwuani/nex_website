// Prefixes a root-relative path with the configured base, so the site also
// works from a subfolder such as a GitHub Pages project site
// (https://<user>.github.io/<repo>/). Absolute URLs pass through unchanged.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const url = (path: string) => (path.startsWith('/') ? `${base}${path}` : path);
