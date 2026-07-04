<template>
  <section v-editable="blok" class="feature section" :class="{ 'feature--reverse': blok.image_position === 'left' }">
    <div class="container feature__grid">
      <div class="feature__media" v-if="blok.image?.filename">
        <NuxtImg
          :src="blok.image.filename"
          :alt="blok.image.alt || ''"
          sizes="sm:100vw md:50vw lg:600px"
          loading="lazy"
          class="feature__img"
          provider="storyblok"
        />
      </div>
      <div class="feature__body">
        <p v-if="blok.eyebrow" class="eyebrow">{{ blok.eyebrow }}</p>
        <h2 v-if="blok.heading">{{ blok.heading }}</h2>
        <RichText v-if="blok.text" :content="blok.text" />

        <dl v-if="blok.stats?.length" class="feature__stats">
          <div v-for="stat in blok.stats" :key="stat._uid" class="feature__stat">
            <dt>{{ stat.value }}</dt>
            <dd>{{ stat.label }}</dd>
          </div>
        </dl>

        <div v-if="blok.buttons?.length" class="feature__actions">
          <BaseButton
            v-for="btn in blok.buttons"
            :key="btn._uid"
            :to="btn.link?.cached_url ? `/${btn.link.cached_url.replace(/^\//, '')}` : btn.link?.url"
            :variant="btn.variant || 'outline'"
          >
            {{ btn.label }}
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ blok: Record<string, any> }>()
</script>

<style scoped lang="scss">
.feature {
  &__grid {
    display: grid;
    gap: $space-12;
    align-items: center;
    grid-template-columns: 1fr;

    @include respond(md) { grid-template-columns: 1fr 1fr; }
  }

  &--reverse .feature__media { order: 2; }

  &__img { border-radius: $radius-lg; width: 100%; }

  &__body { display: flex; flex-direction: column; gap: $space-4; }

  &__stats {
    display: flex;
    flex-wrap: wrap;
    gap: $space-8;
    margin: 0;
    padding-top: $space-4;
  }
  &__stat dt { font-size: $fs-3xl; font-weight: $fw-bold; color: $color-primary; }
  &__stat dd { margin: 0; color: $color-text-muted; font-size: $fs-sm; }

  &__actions { display: flex; gap: $space-4; flex-wrap: wrap; margin-top: $space-2; }
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: $fw-semibold;
  color: $color-primary;
  font-size: $fs-sm;
}
</style>
