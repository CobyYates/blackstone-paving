/**
 * SPA page-view tracking for GTM + GA4.
 *
 * The head snippets (app.vue) only fire a page_view on the initial document
 * load. A Nuxt SPA navigates client-side without a reload, so - to match the
 * previous WordPress site where every page was a fresh load - we emit a
 * page_view on each subsequent route change:
 *   • GA4  → gtag('event', 'page_view', …)
 *   • GTM  → dataLayer.push({ event: 'page_view', … }) so container triggers fire
 *
 * Client-only (`.client`) and production-only, matching app.vue.
 */
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export default defineNuxtPlugin(() => {
  if (import.meta.dev) return

  const { gtmId, gtagId } = useRuntimeConfig().public
  if (!gtmId && !gtagId) return

  const router = useRouter()
  let initialLoad = true

  router.afterEach((to) => {
    // Skip the first navigation - the initial page_view is sent by the head snippets.
    if (initialLoad) {
      initialLoad = false
      return
    }

    // Defer so the new document.title (set via useHead) is applied first.
    nextTick(() => {
      const payload = {
        page_path: to.fullPath,
        page_location: window.location.href,
        page_title: document.title,
      }
      if (gtagId && typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', payload)
      }
      if (gtmId && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: 'page_view', ...payload })
      }
    })
  })
})
