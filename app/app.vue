<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Site-wide default meta. Per-page values (title, description, canonical, OG)
// are set with useSeoMeta() inside each page and merged over these.
useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Blackstone Paving and Construction',
  twitterCard: 'summary_large_image',
})

// ---------------------------------------------------------------------------
// Analytics - Google Tag Manager + GA4 (gtag.js).
// SSR-rendered into every page (matches the previous WordPress markup): the GTM
// loader goes high in <head>, its <noscript> fallback right after <body>, and
// GA4's gtag alongside. IDs come from runtimeConfig (NUXT_PUBLIC_GTM_ID /
// NUXT_PUBLIC_GTAG_ID). Loaded in production only so localhost doesn't pollute
// analytics. SPA route-change page_views come from plugins/analytics.client.ts.
// ---------------------------------------------------------------------------
const { gtmId, gtagId } = useRuntimeConfig().public

if (!import.meta.dev && (gtmId || gtagId)) {
  useHead({
    script: [
      gtmId && {
        key: 'gtm',
        tagPriority: 1, // as early in <head> as possible, per GTM guidance
        innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`,
      },
      gtagId && {
        key: 'ga-lib',
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${gtagId}`,
      },
      gtagId && {
        key: 'ga-init',
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gtagId}');`,
      },
    ].filter(Boolean) as Record<string, unknown>[],
    noscript: gtmId
      ? [
          {
            tagPosition: 'bodyOpen',
            innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          },
        ]
      : [],
  })
}
</script>
