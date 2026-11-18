# Airogine website

The website of Airogine, the company that makes Nexus, its only product (as Inductive Automation
makes Ignition). The site carries Airogine's name in the header, footer, legal lines and Open Graph
site name; every product page and the documentation are about Nexus. Built from the product website brief (27 Oct 2026). It is a static
[Astro](https://astro.build) site: plain HTML and CSS, a few lines of JavaScript for the menus and
the demo form, and cookieless visit statistics from Vercel Web Analytics.

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

The site is at **https://www.airogine.com**, hosted on Vercel, which builds and publishes every
push to `main` (`airogine.com` redirects to `www`). The domain is `site` in `astro.config.mjs`.

It used to be published to GitHub Pages too. That workflow is gone so search engines see one copy
of the site; turn Pages off in the repository's settings so the old copy stops being served.

To build for somewhere else, such as a preview under a subfolder, set `SITE_URL` and `BASE_PATH`.
Internal links go through `url()` in `src/lib/url.ts`, which adds the prefix. Use it for any new
root-relative link.

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
| `/docs/` | The user documentation: a home page and one page per topic (see below) |
| `/privacy/` | Privacy policy (`src/pages/privacy.astro`) |
| `/terms/` | Terms of use, with the trademark notice (`src/pages/terms.astro`) |

The feature and audience pages share `src/layouts/Feature.astro`: headline, intro, proof points,
then one large visual. Each page's own copy is at the top of its file in `src/pages/`. The audience
pages pull together facts from the feature pages for the system integrator and operations readers
named in the brief, and link onward to the relevant feature pages.

## Documentation

`/docs/` is the user documentation: what everything on the platform does and how to use it, for
operators, engineers and administrators.

- Each topic is a Markdown file in `src/content/docs/` (title and description in its frontmatter).
- The sidebar order and sections are in `src/data/docs.ts`. The build fails if a page isn't listed
  there, or a listed page has no file.
- Pages are rendered by `src/pages/docs/[...slug].astro` inside `src/layouts/Docs.astro`
  (sidebar, "On this page", previous/next). Styles are in `src/styles/docs.css`.
- Search runs in the browser from `/docs/search.json`, built from the Markdown at build time and
  loaded the first time someone uses the search box. `/` focuses it.
- Link between docs pages with relative links (`../tags/`, `../alarms/#alarm-types`), so they work
  under a GitHub Pages subfolder too.
- Facts come from the product: the app's own labels, `DEPLOYMENT.md` and the code. When the product
  changes, update the matching page. The claims guardrails below apply to the docs too.
- Screenshots are WebP files in `src/assets/docs/`, added with an ordinary Markdown image and a
  relative path (`![What it shows](../../assets/docs/trends.webp)`), so Astro sizes them and
  loads them lazily. Readers can click one to see it full size. Write alt text that says what the
  screen shows.
- They come from a gateway running the Riverside demo plant (`deploy/demo` in the Nexus repo), in
  the app's default dark theme, at 1440×900 and 2x. Convert each to WebP 1600 px wide
  (`cwebp -q 82 -resize 1600 0 in.png -o out.webp`). Retake a screenshot when its screen changes.

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

- **Demo requests**: the form posts to the Vercel Function in `api/demo.ts`, which emails each
  request through [Resend](https://resend.com), with the visitor as reply-to. It needs three
  environment variables in the Vercel project: `RESEND_API_KEY`; `DEMO_FROM_EMAIL`, a sender on a
  domain verified in Resend (for example `Airogine website <demo@airogine.com>`); and
  `DEMO_TO_EMAIL`, where requests go (several addresses separated by commas). Until all three are set, the form says the request couldn't
  be sent. `npm run dev` doesn't serve the function; use `vercel dev` to try it locally.
- **Docs**: `docsUrl` and `deploymentGuideUrl` point at `/docs/`. The brief asks for every security
  claim to link to its section of the docs; the matching pages are `/docs/security/`,
  `/docs/users-and-roles/`, `/docs/sign-in-providers/` and `/docs/redundancy/`.
- **Security overview PDF**: the download button on `/security/` appears once
  `securityOverviewPdf` is set.
- **Company and product**: `company` (Airogine) is used in the footer copyright line, `product` (Nexus)
  names the product. The brand positioning is `companyTagline` ("Engineering the future of industrial
  operations.", in the footer and the Organization's structured data) and `productTagline` ("The
  operating platform for modern manufacturing.", in the home page title and hero, the Nexus menu, the
  share card and the SoftwareApplication's structured data). The header and footer show the Airogine wordmark (`src/components/Wordmark.astro`,
  type only until there is a logo); the Nexus mark (`Logo.astro`) stays with the product, in the
  Nexus menu and the favicon.
- **Privacy policy and terms of use**: written from what the site actually does (no cookies or
  third-party requests; cookieless Vercel Web Analytics; the demo form; Vercel's logs) and what Nexus sends when it
  licenses online. If the site starts using a form service, analytics or anything else that
  handles personal information, update `/privacy/` in the same change. Both need legal review.
  Still open in `site.legal`: `contactEmail` (until it's set, both pages say the address is
  coming) and `state`, the US state Airogine is organized in (named as the governing law).
- **Pricing and main call to action**: there is no Pricing page. Book a demo is the call to action
  throughout, as the brief proposes.
- **Social profiles**: `site.profiles` lists the company's profiles for the structured data.

## Search engines

- Every page has a canonical URL, a description, Open Graph and Twitter tags, and
  `index, follow` (the 404 page is `noindex`). Keep titles under 60 characters and descriptions
  between 70 and 160.
- Structured data (JSON-LD) is built in `src/layouts/Base.astro`: Airogine as the Organization and
  WebSite on every page, Nexus as a SoftwareApplication on the home page, a BreadcrumbList on
  feature, docs, legal and other inner pages, and each docs page as a TechArticle about Nexus.
- `robots.txt` and the sitemap (`/sitemap-index.xml`) are built from the domain. Submit the
  sitemap in Google Search Console and Bing Webmaster Tools once the domain is verified there.

## Claims guardrails

The copy follows the brief's "Claims to keep accurate" rules. When you edit, keep it that way:

- no competitor names
- no vendor logos
- no certification claims
- no performance or capacity numbers
- no "unlimited"
- no "signed installer"

The How it works page states the current limits plainly: Nexus for Mac is for evaluations and runs on Apple Silicon only, redundancy
needs an external database, and the Windows installer is not code-signed yet. The AI assistant
page says it needs internet access to Anthropic's API, needs the plant's own API key, and lists
exactly what is sent.
