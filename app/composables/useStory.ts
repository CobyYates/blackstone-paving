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
  // SDK v11 nests options: `api` = Storyblok CDN query params, `bridge` = live
  // preview options. (Passing flat options silently no-ops and then throws.)
  // It also returns a wrapper `{ data, story, ... }` - `story` is the computed
  // ref of the story data (what callers expect as `.value`).
  const { story } = await useAsyncStoryblok(slug, {
    api: {
      version,
      resolve_links: 'url',
      // Resolve story references (e.g. the Latest Projects grid) into full
      // story objects so components can read their content directly.
      resolve_relations: ['latestProjects.projects'],
    },
    bridge: { resolveLinks: 'url', resolveRelations: ['latestProjects.projects'] },
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
