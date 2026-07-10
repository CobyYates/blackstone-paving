<template>
  <section v-editable="blok" class="latest section">
    <div class="container">
      <header class="latest__header">
        <p v-if="blok.eyebrow" class="eyebrow">{{ blok.eyebrow }}</p>
        <h2 v-if="blok.heading">{{ blok.heading }}</h2>
      </header>

      <ul class="latest__grid">
        <li v-for="p in projects" :key="p.uuid" class="latest__item">
          <article class="project-card">
            <div v-if="p.image" class="project-card__media">
              <NuxtImg
                :src="p.image"
                :alt="p.title || 'Project photo'"
                sizes="xs:100vw sm:50vw lg:33vw"
                loading="lazy"
                class="project-card__img"
                provider="storyblok"
              />
            </div>
            <div class="project-card__body">
              <h3 class="project-card__title">{{ p.title }}</h3>
              <p v-if="p.description" class="project-card__desc">{{ p.description }}</p>
              <BaseButton :to="p.to" variant="primary" class="project-card__btn">
                View Project
              </BaseButton>
            </div>
          </article>
        </li>
      </ul>

      <div v-if="showViewAll" class="latest__all">
        <BaseButton :to="viewAllTo" variant="primary">
          {{ blok.viewAllLabel || 'View All' }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ blok: Record<string, any> }>()

// `projects` is a story-reference field. With resolve_relations it comes back as
// full story objects; without resolution it's an array of UUID strings (skipped).
const projects = computed(() =>
  (props.blok.projects || [])
    .filter((p: any) => p && typeof p === 'object' && p.content)
    .map((p: any) => ({
      uuid: p.uuid,
      title: p.content.title || p.name,
      description: p.content.cardDescription,
      image: p.content.cardImage?.filename || undefined,
      to: `/${(p.full_slug || p.slug || '').replace(/^\//, '')}`,
    })),
)

const viewAllTo = computed(() => {
  const l = props.blok.viewAllLink
  if (l?.cached_url) return `/${String(l.cached_url).replace(/^\//, '')}`
  if (l?.url) return l.url
  return '/projects'
})

// Only render the "View All" action when the block opts in (label or link set),
// so a listing page that reuses this block doesn't link to itself.
const showViewAll = computed(
  () =>
    projects.value.length > 0 &&
    !!(props.blok.viewAllLabel || props.blok.viewAllLink?.cached_url || props.blok.viewAllLink?.url),
)
</script>

<style scoped lang="scss">
.latest {
  background: $color-white;
  color: $color-charcoal;

  &__header { text-align: center; margin-bottom: $space-12; }

  &__grid {
    list-style: none;
    padding: 0;
    display: grid;
    gap: $space-8;
    grid-template-columns: 1fr;

    @include respond(sm) { grid-template-columns: repeat(2, 1fr); }
    @include respond(lg) { grid-template-columns: repeat(3, 1fr); }
  }

  &__all { margin-top: $space-12; display: flex; justify-content: center; }
}

.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: $space-4;

  &__media {
    overflow: hidden;
    border-radius: $radius-lg;
    aspect-ratio: 4 / 3;
  }
  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease;
    .project-card:hover & { transform: scale(1.04); }
  }

  &__body { display: flex; flex-direction: column; gap: $space-3; align-items: flex-start; }
  &__title { font-size: $fs-lg; color: $color-black; }
  &__desc { color: $color-charcoal; font-size: $fs-sm; }
  &__btn { margin-top: $space-2; }
}
.latest .eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: $fw-semibold;
  color: $color-primary-on-light;
  font-size: $fs-sm;
}
.latest h2 {
  color: $color-black;
}
</style>
