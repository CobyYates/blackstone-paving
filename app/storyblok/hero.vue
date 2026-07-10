<template>
  <section
    v-editable="blok"
    class="hero"
    :class="{ 'hero--with-services': blok.services?.length }"
  >
    <NuxtImg
      v-if="blok.backgroundImage?.filename"
      :src="blok.backgroundImage.filename"
      :alt="blok.backgroundImage.alt || ''"
      class="hero__bg"
      sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw"
      loading="eager"
      fetchpriority="high"
      preload
      provider="storyblok"
    />
    <div class="hero__overlay" />
    <div class="container hero__layout">
      <div class="hero__content">
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

      <div v-if="blok.services?.length" class="hero__services-wrap">
        <h2 class="visually-hidden">Our services</h2>
        <ul class="hero__services">
          <li v-for="card in blok.services" :key="card._uid">
            <StoryblokComponent :blok="card" />
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ blok: Record<string, any> }>();

// Storyblok link field → usable href/path.
const resolveLink = (link: any): string =>
  link?.url || link?.cached_url
    ? `/${(link.cached_url || "").replace(/^\//, "")}`
    : link?.url || "/";
</script>

<style scoped lang="scss">
.hero {
  position: relative;
  display: grid;
  align-items: center;
  min-height: clamp(480px, 80vh, 760px);
  padding-block: $space-16;
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
      to bottom,
      rgba($color-black, 0.35) 0%,
      rgba($color-black, 0.95) 60%
    );
    @include respond(lg) {
      background: linear-gradient(
        to right,
        rgba($color-black, 0.4) 0%,
        rgba($color-black, 0.75) 100%
      );
    }
  }

  // Single column (mobile): content, then services stacked below.
  // Two columns (desktop): content left, services to the right.
  &__layout {
    display: grid;
    gap: $space-8;
    align-items: center;
    grid-template-columns: 1fr;
  }

  &--with-services &__layout {
    @include respond(lg) {
      grid-template-columns: 1fr minmax(320px, 400px);
      gap: $space-16;
    }
  }

  &__content {
    max-width: 720px;
    display: flex;
    flex-direction: column;
    gap: $space-6;
  }

  &__services {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: $space-4;
  }

  &__eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: $fw-semibold;
    color: $color-primary;
    font-size: $fs-xl;
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
