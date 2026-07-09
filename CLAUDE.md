# CLAUDE.md - Blackstone Paving

Guidance for any AI/dev working in this repo. **Read this before adding code.**
The three non-negotiables: **accessibility**, **small bundle / small files**, and
**complete SEO**. Every change is judged against them.

## What this is
- **Nuxt 4** (SSR) marketing site for Blackstone Paving and Construction.
- Content from **Storyblok** (headless CMS) with the **Bridge** for live preview.
- **SCSS** for styling (no UI framework - see below).
- **EmailJS** for the contact/quote form (client-side, no backend needed).
- Hosted on **Cloudflare Pages** (Nitro `cloudflare-pages` preset → `dist/`).
- Replaces a WordPress site; must match its SEO surface and page set.

## Directory map (Nuxt 4 `app/` layout)
```
app/
  app.vue                 # root; site-wide default meta
  error.vue               # 404 / error page
  layouts/default.vue     # header + <main> + footer, skip link
  pages/
    index.vue             # loads Storyblok story "home"
    [...slug].vue         # loads any story by slug (/contact, /our-mission, …)
  components/
    AppHeader.vue AppFooter.vue
    ui/                   # BaseButton, AppIcon, RichText (reusable primitives)
  storyblok/              # ONE .vue per Storyblok component (filename == technical name)
  composables/            # useStory, useStorySeo
  assets/scss/            # _variables, _mixins (auto-injected), main.scss (base)
server/api/__sitemap__/urls.ts   # dynamic sitemap from Storyblok
public/                   # favicon.svg, logo.svg, static assets
nuxt.config.ts  wrangler.toml  .env(.example)
```

## Golden rules

### 1. Bundle & file size (hard priority)
- **No component/UI framework.** Vuetify + MDI font were deliberately dropped
  (~300KB+). Do **not** add Vuetify, Bootstrap, Tailwind runtime, Element, etc.
- **No icon fonts.** Icons are inline SVG in `app/components/ui/AppIcon.vue`.
  Add a `<path>` there; don't install an icon package.
- Before adding **any** dependency: is it >~15KB gzipped? Can plain Vue/CSS do it?
  If unsure, don't - ask. Prefer native platform features
  (`<details>`, `dialog`, `Intl`, CSS `aspect-ratio`, container queries).
- **Lazy-load** anything non-critical: dynamic `import()` on interaction
  (see EmailJS in `contact_form.vue`), `<LazyXxx>` components, `loading="lazy"`
  on below-the-fold images.
- Keep single files focused and small; split a component once it passes ~200 lines.
- Sanity-check weight with `npm run analyze` after nontrivial changes.

### 2. Accessibility (WCAG 2.1 AA)
- Semantic HTML first: `<header> <nav> <main> <section> <footer> <button> <a>`.
  Never a `<div>` with a click handler where a button/link belongs.
- Every `<img>`/`<NuxtImg>` needs meaningful `alt` (empty `alt=""` only if decorative).
- All form inputs have a `<label for>`; show errors with text + `aria-invalid`;
  announce status via `role="status"` / `role="alert"`.
- Keyboard: everything operable without a mouse. Keep the global focus ring
  (`@include focus-ring`) - never `outline: none` without a replacement.
- Respect `prefers-reduced-motion` (already handled globally in `main.scss`).
- Maintain ≥4.5:1 text contrast. The amber `$color-primary` on dark passes; amber
  as *text on white* does not - use it on dark or as fills only.
- Keep the `.skip-link` in the layout.

### 3. SEO (WordPress/Yoast parity)
- Every page sets title + description via `useSeoMeta` (pages use `useStorySeo`,
  which reads Storyblok SEO fields). Don't ship a page without them.
- Canonical, OG/Twitter defaults, robots.txt, and `LocalBusiness` JSON-LD are
  handled by `@nuxtjs/seo` + config - keep `site.url` / identity accurate.
- New routes must appear in the sitemap: Storyblok stories are automatic via
  `server/api/__sitemap__/urls.ts`; hard-coded routes go in `nuxt.config` sitemap.
- Add structured data where it helps (FAQ → `defineQuestion`, done in `faq.vue`;
  breadcrumbs, services, reviews are good next candidates).
- Keep SSR **on** - crawlers must get real HTML. Don't switch to `ssr: false`.
- Preserve old WordPress URLs with 301s in `routeRules` when a slug changes.

## Storyblok conventions
- One `.vue` in `app/storyblok/` per Storyblok component; **the filename must equal
  the component's technical name** (e.g. `serviceCard.vue` ↔ `serviceCard`). The
  module auto-registers them; `<StoryblokComponent :blok>` resolves by name.
- **Technical names must be camelCase, never snake_case.** Vue's `resolveComponent`
  converts hyphens but not underscores, so `service_card` would not resolve to the
  registered `ServiceCard`. Avoid names that collide with UI components (there is
  already a `RichText` UI renderer - the CMS text block is `textBlock`).
- Every rendered block gets `v-editable="blok"` so the Bridge can highlight it.
- Fetch stories only through `useStory(slug)` (handles draft-in-preview vs
  published-in-prod). Never hard-code the token or call the API ad hoc in a page.
- Current content model: `page` (root, field `sections`) and `project` (root,
  pages under `projects/`), `hero`, `services` + `serviceCard`, `feature`
  (+ inline `stat`), `faq` (+ inline `faqItem`), `gallery`, `cta`, `contactForm`,
  `textBlock`, `latestProjects` (references `project` pages), plus data-only
  `button` / `formField`. Mirror these field names when adding blocks. The schema
  is defined once in `scripts/storyblok-sync.mjs` - run `npm run sb:sync` to push.
- Render richtext with `ui/RichText.vue` (uses `renderRichText`), never `v-html` raw.

## SCSS conventions
- `_variables.scss` and `_mixins.scss` are **auto-injected** into every
  `<style lang="scss">`. Use the tokens/mixins freely; **never `@use` them again**
  (Sass errors with "module already loaded").
- Use design tokens (`$color-*`, `$space-*`, `$fs-*`, `$radius*`) - no magic numbers/hex.
- Component styles are `scoped`; global base/reset lives only in `main.scss`.
- Mobile-first: base styles for small screens, `@include respond(md|lg|xl)` to scale up.
- BEM-ish naming inside components (`.block__element--modifier`).

## Env & config
- All secrets/config come from env → `runtimeConfig` (see `.env.example`).
  Public browser values use the `NUXT_PUBLIC_` prefix. Never hard-code keys.
- EmailJS keys are public by design; the Storyblok token stays server-side.

## Commands
```
npm run dev        # local dev (needs .env with a Storyblok preview token)
npm run build      # production build → dist/  (Cloudflare Pages output dir)
npm run preview    # preview the built app locally
npm run analyze    # inspect bundle size
npm run typecheck  # vue-tsc
npm run cf:deploy  # build + wrangler pages deploy dist
```

## Deploy (Cloudflare Pages)
- Build command `npm run build`, output directory `dist`.
- Set env vars in the Pages dashboard (Production + Preview) - same keys as `.env.example`.
- `compatibility_flags = ["nodejs_compat"]` is required (in `wrangler.toml`).
