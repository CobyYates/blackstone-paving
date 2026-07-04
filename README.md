# Blackstone Paving and Construction

Marketing website for Blackstone Paving and Construction, built with **Nuxt 4**,
**Storyblok** (headless CMS with live preview), and **SCSS**, deployed to
**Cloudflare Pages**. Contact/quote forms are handled by **EmailJS** (no backend).

Replaces the previous WordPress site with equivalent SEO (sitemap, robots,
canonical URLs, Open Graph, and `LocalBusiness` / `FAQPage` structured data).

> Working in this repo with an AI assistant? Read **[CLAUDE.md](./CLAUDE.md)** first —
> it defines the accessibility, bundle-size, and SEO rules the project must uphold.

## Tech stack
| Concern | Choice | Why |
|---|---|---|
| Framework | Nuxt 4 (SSR) | Server-rendered HTML for SEO |
| CMS | Storyblok + Bridge | Live visual editing / preview |
| Styling | SCSS (no UI framework) | Smallest possible bundle; fast on Cloudflare |
| Icons | Inline SVG (`AppIcon`) | Avoids a ~150KB icon font |
| Images | `@nuxt/image` (Storyblok provider) | AVIF/WebP + responsive srcset |
| SEO | `@nuxtjs/seo` | Sitemap, robots, canonical, OG, schema.org |
| Forms | EmailJS (lazy-loaded) | No server; kept out of the initial bundle |
| Hosting | Cloudflare Pages | Edge, fast, cheap |

> **Vuetify was intentionally not used.** Vuetify + the MDI icon font add 300KB+
> and would undercut the small-bundle / fast-site goal. Lightweight SCSS
> components are used instead.

## Prerequisites
- Node `>=20.11` (see `.nvmrc`)
- A Storyblok space (US region) with a **preview** access token
- An EmailJS account (service + template + public key)

## Getting started
```bash
npm install
cp .env.example .env      # then fill in the values
npm run dev               # http://localhost:3000
npm run dev:https         # https://localhost:3000 — required for Storyblok live preview
```

> Storyblok's Visual Editor loads the site in an HTTPS iframe, so use
> `npm run dev:https` (Nuxt generates a self-signed cert) when editing content
> live. Plain `npm run dev` is fine for regular development.

### Environment variables
See `.env.example`. Summary:

| Variable | Purpose |
|---|---|
| `NUXT_STORYBLOK_ACCESS_TOKEN` | Storyblok token (preview for dev, public for prod) |
| `NUXT_PUBLIC_SITE_URL` | Canonical base URL (SEO, sitemap, robots) |
| `NUXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS service |
| `NUXT_PUBLIC_EMAILJS_TEMPLATE_ID` | EmailJS template |
| `NUXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS public key |
| `NUXT_PUBLIC_GTAG_ID` | Google Analytics/Ads id (optional) |

## Storyblok setup
1. Create a space in the **US** region (matches `apiOptions.region: 'us'`).
2. In **Settings → Visual Editor**, set the preview URL to
   `https://localhost:3000/` (dev) and your production domain (prod).
3. Create the content types below (technical name → fields). Each maps 1:1 to a
   file in `app/storyblok/`.

### Content model
> **Naming rule:** Storyblok technical names must be **camelCase** (e.g.
> `serviceCard`), not snake_case. Vue's component resolver converts hyphens but
> not underscores, so `service_card` would fail to render. Each name maps to the
> matching file in `app/storyblok/`.

| Component (technical name) | Key fields |
|---|---|
| `page` | `body` (blocks), `title`, `seo_title`, `seo_description`, `keywords`, `og_image` (asset), `no_index` (bool) |
| `hero` | `eyebrow`, `title`, `subtitle`, `background_image` (asset), `buttons` (blocks: `label`, `link`, `variant`) |
| `services` | `eyebrow`, `heading`, `subheading`, `items` (`serviceCard` blocks) |
| `serviceCard` | `icon` (option: phone/mail/pin/check/arrow/plus), `image` (asset, fallback), `title`, `description`, `link` |
| `feature` | `eyebrow`, `heading`, `text` (richtext), `image`, `image_position` (left/right), `stats` (blocks), `buttons` |
| `stat` | `value`, `label` (rendered inline by `feature`) |
| `faq` | `eyebrow`, `heading`, `exclusive` (bool), `items` (`faqItem` blocks) |
| `faqItem` | `question`, `answer` (richtext) (rendered inline by `faq`) |
| `gallery` | `eyebrow`, `heading`, `images` (multi-asset) |
| `cta` | `heading`, `text`, `buttons` |
| `contactForm` | `eyebrow`, `heading`, `description`, `anchor_id`, `fields` (blocks), `submit_label`, `success_message` |
| `textBlock` | `content` (richtext) |

Create a story with slug **`home`** (type `page`) plus `contact` and
`our-mission` to match the site navigation.

Live preview (the Bridge) works automatically: opening the site inside the
Storyblok Visual Editor renders draft content and updates as you type.

## EmailJS setup
1. Create an email **service** and a **template** in the EmailJS dashboard.
2. Use template variables matching the form field names (`name`, `email`,
   `phone`, `service`, `message`).
3. Put the service id, template id, and public key in `.env`
   (and in the Cloudflare Pages env for production).

The EmailJS SDK is dynamically imported only when a form is submitted, so it
never touches SSR or the initial page load.

## Deploy to Cloudflare Pages
**Git integration (recommended):**
1. Push this repo to GitHub/GitLab.
2. Cloudflare dashboard → **Pages → Create → Connect to Git**.
3. Framework preset: *Nuxt*. Build command: `npm run build`.
   Build output directory: `dist`.
4. Add the env vars from `.env.example` (Production **and** Preview).
5. Deploy. `wrangler.toml` already sets `nodejs_compat`.

**Direct upload:**
```bash
npm run cf:deploy      # builds and runs `wrangler pages deploy dist`
```

## Scripts
| Command | Description |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm run generate` | Static/prerendered build |
| `npm run analyze` | Bundle size analysis |
| `npm run typecheck` | Type-check with `vue-tsc` |
# blackstone-paving
