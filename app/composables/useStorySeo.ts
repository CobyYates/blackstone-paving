/**
 * Maps a Storyblok content object's SEO fields onto the page head.
 * Canonical URLs, robots, sitemap and JSON-LD identity are handled globally by
 * @nuxtjs/seo - this only fills in the per-page title/description/OG values.
 *
 * Expected (optional) fields on the story content, matching common CMS + Yoast:
 *   title | seoTitle, description | seoDescription, keywords[],
 *   ogImage | image { filename }, noIndex (bool)
 */
export function useStorySeo(content: Record<string, any> | undefined | null) {
  if (!content) return

  const siteName = 'Blackstone Paving and Construction'
  const title = content.seoTitle || content.title || siteName
  const description = content.seoDescription || content.description || ''
  const image =
    content.ogImage?.filename || content.image?.filename || undefined
  const keywords = Array.isArray(content.keywords)
    ? content.keywords.join(', ')
    : content.keywords || undefined

  useSeoMeta({
    title,
    description,
    keywords,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    robots: content.noIndex ? 'noindex, nofollow' : undefined,
  })
}
