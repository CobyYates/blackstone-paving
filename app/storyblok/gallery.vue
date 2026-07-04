<template>
  <section v-editable="blok" class="gallery section">
    <div class="container">
      <header v-if="blok.heading" class="gallery__header">
        <p v-if="blok.eyebrow" class="eyebrow">{{ blok.eyebrow }}</p>
        <h2>{{ blok.heading }}</h2>
      </header>
      <ul class="gallery__grid">
        <li v-for="(img, i) in blok.images" :key="img.id || i" class="gallery__item">
          <NuxtImg
            :src="img.filename"
            :alt="img.alt || blok.heading || 'Project photo'"
            sizes="sm:100vw md:50vw lg:33vw"
            loading="lazy"
            class="gallery__img"
            provider="storyblok"
          />
          <figcaption v-if="img.title" class="gallery__caption">{{ img.title }}</figcaption>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ blok: Record<string, any> }>()
</script>

<style scoped lang="scss">
.gallery {
  &__header { margin-bottom: $space-12; text-align: center; }

  &__grid {
    list-style: none;
    padding: 0;
    display: grid;
    gap: $space-4;
    grid-template-columns: 1fr;

    @include respond(sm) { grid-template-columns: repeat(2, 1fr); }
    @include respond(lg) { grid-template-columns: repeat(3, 1fr); }
  }

  &__item {
    position: relative;
    overflow: hidden;
    border-radius: $radius-lg;
    aspect-ratio: 4 / 3;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease;
    .gallery__item:hover & { transform: scale(1.05); }
  }

  &__caption {
    position: absolute;
    inset: auto 0 0 0;
    padding: $space-4;
    background: linear-gradient(0deg, rgba($color-black, 0.8), transparent);
    font-size: $fs-sm;
    font-weight: $fw-medium;
  }
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: $fw-semibold;
  color: $color-primary;
  font-size: $fs-sm;
}
</style>
