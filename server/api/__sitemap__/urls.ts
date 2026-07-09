import type { SitemapUrlInput } from '#sitemap/types'

/**
 * Dynamic sitemap source: lists every published Storyblok story so the sitemap
 * stays in sync with the CMS (WordPress/Yoast parity). Wired up in nuxt.config
 * via `sitemap.sources`.
 *
 * Uses the lightweight `/cdn/links` endpoint (slugs only, no full content).
 */
export default defineSitemapEventHandler(async () => {
  const token = process.env.NUXT_STORYBLOK_ACCESS_TOKEN
  if (!token) return []

  try {
    const res = await $fetch<{ links: Record<string, any> }>(
      'https://api.storyblok.com/v2/cdn/links',
      { query: { token, version: 'published', per_page: 1000 } },
    )

    return Object.values(res.links || {})
      .filter((link) => !link.is_folder && !link.slug?.startsWith('_'))
      .map((link): SitemapUrlInput => {
        const slug = link.slug === 'home' ? '' : link.slug
        return {
          loc: `/${slug}`,
          lastmod: link.published_at || undefined,
        }
      })
  } catch (err) {
    console.error('[sitemap] Failed to fetch Storyblok links:', err)
    return []
  }
})
