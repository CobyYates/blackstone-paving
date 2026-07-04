import type { ISbStoryData } from '@storyblok/nuxt'

/**
 * Fetch a Storyblok story with the correct version:
 *  - "draft"     inside the Storyblok Visual Editor (live Bridge preview) and in dev
 *  - "published" for the public production site
 *
 * The Visual Editor loads the site inside an iframe with `_storyblok` query
 * params, which we detect to switch into draft mode automatically.
 */
export async function useStory(slug: string) {
  const route = useRoute()
  const isPreview =
    import.meta.dev || typeof route.query._storyblok !== 'undefined'

  const version = isPreview ? 'draft' : 'published'

  // useAsyncStoryblok registers the Bridge for live updates when available.
  const story = await useAsyncStoryblok(slug, {
    version,
    resolveLinks: 'url',
  })

  if (!story.value) {
    throw createError({
      statusCode: 404,
      statusMessage: `Story not found: ${slug}`,
      fatal: true,
    })
  }

  return story as Ref<ISbStoryData>
}
