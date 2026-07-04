<template>
  <section v-editable="blok" class="hero">
    <NuxtImg
      v-if="blok.background_image?.filename"
      :src="blok.background_image.filename"
      :alt="blok.background_image.alt || ''"
      class="hero__bg"
      sizes="100vw"
      loading="eager"
      fetchpriority="high"
      preload
      provider="storyblok"
    />
    <div class="hero__overlay" />
    <div class="container hero__content">
      <p v-if="blok.eyebrow" class="hero__eyebrow">{{ blok.eyebrow }}</p>
      <h1 v-if="blok.title">{{ blok.title }}</h1>
      <p v-if="blok.subtitle" class="hero__subtitle">{{ blok.subtitle }}</p>
      <div v-if="blok.buttons?.length" class="hero__actions">
        <BaseButton
          v-for="btn in blok.buttons"
          :key="btn._uid"
          :to="resolveLink(btn.link)"
          :variant="btn.variant || 'primary'"
        >
          {{ btn.label }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ blok: Record<string, any> }>()

// Storyblok link field → usable href/path.
const resolveLink = (link: any): string =>
  link?.url || link?.cached_url ? `/${(link.cached_url || '').replace(/^\//, '')}` : (link?.url || '/')
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  display: grid;
  align-items: center;
  min-height: clamp(480px, 80vh, 760px);
  overflow: hidden;
  isolation: isolate;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: -2;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(
      180deg,
      rgba($color-black, 0.55) 0%,
      rgba($color-black, 0.75) 100%
    );
  }

  &__content {
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: $space-6;
  }

  &__eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: $fw-semibold;
    color: $color-primary;
    font-size: $fs-sm;
  }

  &__subtitle {
    font-size: $fs-lg;
    color: $color-gray-light;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: $space-4;
    margin-top: $space-2;
  }
}
</style>
