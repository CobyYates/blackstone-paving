// https://nuxt.com/docs/api/configuration/nuxt-config
// Blackstone Paving - Nuxt 4 + Storyblok, deployed to Cloudflare Pages.
// Design goals (see CLAUDE.md): small bundle, fast TTFB, accessible, SEO-complete.
import { existsSync } from 'node:fs'

// Local HTTPS for the Storyblok Visual Editor. `npm run dev:https` serves over
// TLS using an mkcert-generated, locally-trusted cert in certs/ (no browser
// warning). If the certs aren't generated yet it falls back to Nuxt's built-in
// self-signed cert (the old behaviour). Plain `npm run dev` stays HTTP.
const httpsDev = process.env.npm_lifecycle_event === 'dev:https'
const hasCerts =
  existsSync('certs/localhost.pem') && existsSync('certs/localhost-key.pem')
const devHttps = httpsDev
  ? hasCerts
    ? { key: 'certs/localhost-key.pem', cert: 'certs/localhost.pem' }
    : true
  : false

export default defineNuxtConfig({
  devServer: { https: devHttps },

  compatibilityDate: '2025-07-01',

  // SSR is ON for SEO parity with the previous WordPress site (server-rendered HTML,
  // correct meta/canonical/JSON-LD in the initial response for crawlers).
  ssr: true,

  modules: [
    '@storyblok/nuxt',
    '@nuxt/image',
    '@nuxtjs/seo',
  ],

  // Register components without a directory prefix so `app/components/ui/BaseButton.vue`
  // is usable as <BaseButton> (not <UiBaseButton>). Keep filenames unique across folders.
  components: [{ path: '~/components', pathPrefix: false }],

  // ---------------------------------------------------------------------------
  // Runtime configuration
  // Public values are exposed to the browser. Private values stay server-side.
  // Any NUXT_PUBLIC_* env var automatically overrides the matching public key.
  // ---------------------------------------------------------------------------
  runtimeConfig: {
    // Server-only
    storyblokAccessToken: '', // NUXT_STORYBLOK_ACCESS_TOKEN (also used by the module below)
    // These are read from process.env at BUILD time (Nuxt auto-loads .env), so a
    // local `.env` bakes them into the deploy - the app needs no runtime env on
    // Cloudflare. Values are public (they ship in the browser); the literals are
    // sensible fallbacks when a var is absent.
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://blackstone-paving.com',
      emailjsServiceId: process.env.NUXT_PUBLIC_EMAILJS_SERVICE_ID || '',
      emailjsTemplateId: process.env.NUXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
      emailjsPublicKey: process.env.NUXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
      // Analytics (public IDs - safe in the browser). Injected in app.vue (prod only).
      gtmId: process.env.NUXT_PUBLIC_GTM_ID || 'GTM-NLKDP32D',   // Google Tag Manager
      gtagId: process.env.NUXT_PUBLIC_GTAG_ID || 'G-VELHLHQMLT', // GA4 measurement id
    },
  },

  // ---------------------------------------------------------------------------
  // Storyblok - headless CMS + live preview Bridge
  // The Bridge injects live updates into the Visual Editor. It only loads inside
  // the Storyblok iframe/preview, so it costs the public visitor nothing.
  // ---------------------------------------------------------------------------
  storyblok: {
    accessToken: process.env.NUXT_STORYBLOK_ACCESS_TOKEN,
    bridge: true, // live preview in the Storyblok Visual Editor
    apiOptions: {
      region: 'eu', // matches the "Blackstone Paving" space (eu-central-1)
    },
    componentsDir: '~/storyblok',
  },

  // ---------------------------------------------------------------------------
  // Images - served + optimized through Storyblok's image service (webp/avif,
  // responsive srcset). Keeps transferred bytes tiny without shipping a lib.
  // ---------------------------------------------------------------------------
  image: {
    provider: 'storyblok',
    storyblok: {
      baseURL: 'https://a.storyblok.com',
    },
    format: ['avif', 'webp'],
    quality: 75,
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  // ---------------------------------------------------------------------------
  // SEO (@nuxtjs/seo bundles: sitemap, robots, schema.org, og-image, seo-utils)
  // ---------------------------------------------------------------------------
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://blackstone-paving.com',
    name: 'Blackstone Paving and Construction',
    description:
      'Asphalt paving, asphalt removal, fine grading, and site management for Salt Lake, Utah, and Tooele County. Free estimates.',
    defaultLocale: 'en',
  },
  sitemap: {
    // Dynamic Storyblok slugs are supplied by server/routes/api/__sitemap__/urls.ts
    sources: ['/api/__sitemap__/urls'],
  },
  schemaOrg: {
    // Global LocalBusiness identity - strong local-SEO signal for a paving company.
    identity: {
      type: 'LocalBusiness',
      name: 'Blackstone Paving and Construction',
      logo: '/logo.png',
      email: 'contact@blackstone-paving.com',
      telephone: '+1-435-579-5801',
      address: {
        streetAddress: '3850 Gundersen Cir',
        addressLocality: 'Grantsville',
        addressRegion: 'UT',
        postalCode: '84029',
        addressCountry: 'US',
      },
      areaServed: ['Salt Lake County', 'Utah County', 'Tooele County'],
    },
  },
  ogImage: {
    // Keep the runtime light: no live browser rendering on Cloudflare.
    // Provide static OG images from Storyblok/public instead.
    enabled: false,
  },

  // ---------------------------------------------------------------------------
  // Global styles - SCSS. Variables + mixins are auto-injected into every
  // component <style lang="scss"> block, so never re-@use them (avoids
  // "module already loaded"). main.scss holds the reset + base layer.
  // ---------------------------------------------------------------------------
  css: ['~/assets/scss/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData:
            '@use "~/assets/scss/_variables.scss" as *; @use "~/assets/scss/_mixins.scss" as *;',
        },
      },
    },
  },

  // ---------------------------------------------------------------------------
  // App head defaults (per-page meta is set with useSeoMeta in the pages)
  // ---------------------------------------------------------------------------
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#111111' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  // ---------------------------------------------------------------------------
  // Nitro / Cloudflare Pages
  // Build output is `dist/` (set that as the Pages output directory).
  // routeRules provide edge caching for static assets and legacy redirects.
  // ---------------------------------------------------------------------------
  nitro: {
    preset: 'cloudflare-pages',
    // No build-time prerendering. Pages are rendered by on-request edge SSR
    // (still full HTML for crawlers) so live Storyblok edits appear immediately
    // without a redeploy - important since we deploy manually. To trade that for
    // faster static delivery (content then frozen until the next deploy), you can
    // re-enable it (the .env token is available at build):
    //   prerender: { crawlLinks: true, routes: ['/'], failOnError: false }
    prerender: {
      crawlLinks: false,
      routes: [],
    },
  },
  routeRules: {
    // Long-cache immutable build assets at the edge.
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    // Example WordPress permalink redirects (extend as needed for parity):
    // '/index.php': { redirect: { to: '/', statusCode: 301 } },
    // '/home': { redirect: { to: '/', statusCode: 301 } },
  },

  // ---------------------------------------------------------------------------
  // Build / performance
  // ---------------------------------------------------------------------------
  features: {
    inlineStyles: true, // inline critical CSS, fewer render-blocking requests
  },
  experimental: {
    payloadExtraction: true,
  },

  typescript: {
    strict: true,
  },

  devtools: { enabled: true },
})
