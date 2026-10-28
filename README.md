# Nexus website

The marketing site for Nexus, built from the product website brief (27 Oct 2026). It is a static
[Astro](https://astro.build) site: plain HTML and CSS, a few lines of JavaScript for the menus and
the demo form, and no tracking.

## Run it

```sh
npm install
npm run dev       # http://localhost:4321, reloads as you edit
npm run build     # static site in dist/
npm run preview   # serve dist/ locally
npm run check     # type-check .astro and .ts files
```

`dist/` can be hosted anywhere that serves static files.

## Hosting

Every push to `main` builds the site and publishes it to GitHub Pages
(`.github/workflows/deploy.yml`). Pages serves a project site from a subfolder,
`https://<user>.github.io/<repo>/`, so the workflow passes `SITE_URL` and `BASE_PATH` to the
build. Internal links go through `url()` in `src/lib/url.ts`, which adds that prefix. Use it for
any new root-relative link, or the link will break on Pages.

Built without those variables, the site lives at `/` on the domain in `astro.config.mjs`. Once
the real domain is decided, either set it there and host `dist/` anywhere, or add it to Pages as
a custom domain.

> **Node and Astro versions.** The site uses Astro 6 because this machine has Node 22.14, and
> Astro 7 needs Node 22.23.4 or later. `npm audit` reports advisories against Astro before 7.3.2.
> Most of them affect server rendering or the dev server, not a static build like this one. Even
> so, upgrade before launch: install a current Node 22 or 24, then run `npm i astro@latest`.

## Pages

| Path | Page |
| --- | --- |
| `/` | Home: the nine sections from the brief |
| `/connectivity/` … `/integrations/` | The eight feature pages (Product menu) |
| `/integrators/`, `/operations/` | Audience landing pages ("Who it's for", at the foot of the Product menu and in the footer) |
| `/how-it-works/` | Architecture diagram and installation |
| `/security/` | Security and reliability, for the IT/OT reviewer |
| `/demo/` | Book a demo form |
| `/docs/`, `/privacy/` | Placeholders until the open questions are answered (not indexed) |

The feature and audience pages share `src/layouts/Feature.astro`: headline, intro, proof points,
then one large visual. Each page's own copy is at the top of its file in `src/pages/`. The audience
pages pull together facts from the feature pages for the system integrator and operations readers
named in the brief, and link onward to the relevant feature pages.

## Product visuals

Per the brief, every screenshot must come from a real gateway running the Riverside demo plant.
Until a file is delivered, each slot shows a labelled placeholder naming the asset it is waiting for.

To add one, export it under the name below into `public/shots/` and rebuild. Nothing else needs
to change. Alt text and dimensions are handled for you.

| File | Asset | Page |
| --- | --- | --- |
| `hero-composite.png` (+ `-dark.png`) | Hero composite, 2x | Home |
| `assistant-recording.webm` / `.mp4` (+ `.vtt`, `-poster.png`) | Assistant recording | Home, AI assistant |
| `template-overrides.png` | Template override panel | Templates |
| `create-several.png` | Create several | Templates |
| `operator-app-screens.png` | Operator app on three screens | Applications |
| `symbol-editor.webm` / `.mp4` | Symbol editor loop, 5 s | Applications |
| `alarm-timeline.png` | Alarm timeline | Alarms |
| `on-call-policy.png` | On-call policy | Alarms |
| `trend.png` | Trend | History |
| `shift-report.png` | Shift report | History |
| `script-editor.png` | Script editor | Scripting |
| `device-list.png` | Device list and address editor | Connectivity |
| `system-health.png` | System health | Security |

Any image can also have a `-dark.png` version, which is shown to visitors using dark mode. The
list, with alt text, lives in `src/data/visuals.ts`.

The architecture diagram (How it works) and the multi-site diagram (Integrations) are drawn in
HTML and CSS rather than as SVG, so they reflow to one column on phones and follow light and dark
mode.

`public/og/default.png` is the social sharing image for every page. Edit
`scripts/og-default.html` and run `scripts/make-og.sh` to regenerate it. To give a page its own
image (the brief asks for one per page, taken from its main visual), pass `ogImage` to the `Base`
layout.

## Design

The colour tokens, fonts (Inter and JetBrains Mono, self-hosted) and light/dark behaviour follow
the brief and live in `src/styles/global.css`. The brand gradient appears only on the logo mark
and in the hero. Green, amber and red are not used anywhere, because in the product they mean
running, warning and alarm.

**The logo is a redraw** from the brief's description ("an N drawn as two nodes joined by a
link"). Replace the paths in `src/components/Logo.astro` and `public/favicon.svg` with the ones
from the app's `Logo.tsx` and `favicon.svg`, and re-run `scripts/make-og.sh`.

## Placeholders waiting on the product owner

These map to the open questions in the brief. Everything configurable is in `src/config.ts`, except
the domain, which is in `astro.config.mjs`.

- **Domain**: `site` in `astro.config.mjs` is `https://www.example.com`. Canonical URLs, Open
  Graph tags, `robots.txt` and the sitemap are all built from it.
- **Demo form endpoint**: `demoFormAction` is empty. Until it is set, the form tells the visitor
  that nothing was sent rather than pretending to submit. It posts `name`, `email`, `company`,
  `role`, `protocols` and `devices`.
- **Docs**: `docsUrl` and `deploymentGuideUrl` point at the `/docs/` placeholder page. The brief
  asks for every security claim to link to its section of the docs. Add those links once the docs
  are published.
- **Security overview PDF**: the download button on `/security/` appears once
  `securityOverviewPdf` is set.
- **Company name**: `company` is used in the footer copyright line.
- **Privacy policy**: `/privacy/` is a stub that needs a real, legally reviewed policy.
- **Pricing and main call to action**: there is no Pricing page. Book a demo is the call to action
  throughout, as the brief proposes.
- **Trademark line** in the footer: needs legal review.

## Claims guardrails

The copy follows the brief's "Claims to keep accurate" rules. When you edit, keep it that way:

- no competitor names
- no vendor logos
- no certification claims
- no performance or capacity numbers
- no "unlimited"
- no "signed installer"

The How it works page states the current limits plainly: macOS runs in Docker only, redundancy
needs an external database, and the Windows installer is not code-signed yet. The AI assistant
page says it needs internet access to Anthropic's API, needs the plant's own API key, and lists
exactly what is sent.
