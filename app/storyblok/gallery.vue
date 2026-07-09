<template>
  <section v-editable="blok" class="gallery section">
    <div class="container">
      <header v-if="blok.heading" class="gallery__header">
        <p v-if="blok.eyebrow" class="eyebrow">{{ blok.eyebrow }}</p>
        <h2>{{ blok.heading }}</h2>
      </header>
      <ul class="gallery__grid">
        <li v-for="(img, i) in images" :key="img.id || i">
          <figure class="gallery__item">
            <button
              type="button"
              class="gallery__trigger"
              :aria-label="`View image ${i + 1} of ${images.length}${img.title ? ': ' + img.title : ''} (opens gallery viewer)`"
              @click="openAt(i)"
            >
              <NuxtImg
                :src="img.filename"
                :alt="img.alt || blok.heading || 'Project photo'"
                sizes="sm:100vw md:50vw lg:33vw"
                loading="lazy"
                class="gallery__img"
                provider="storyblok"
              />
            </button>
            <figcaption v-if="img.title" class="gallery__caption">
              {{ img.title }}
            </figcaption>
          </figure>
        </li>
      </ul>
    </div>

    <!-- Lazy: the carousel JS only loads once a viewer is opened. -->
    <LazyLightbox
      v-if="open"
      :images="images"
      :start-index="startIndex"
      @close="onClose"
    />
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ blok: Record<string, any> }>();

const images = computed<any[]>(() => props.blok.images || []);

const open = ref(false);
const startIndex = ref(0);
let opener: HTMLElement | null = null;

function openAt(i: number) {
  opener = document.activeElement as HTMLElement; // restore focus here on close
  startIndex.value = i;
  open.value = true;
}
function onClose() {
  open.value = false;
  nextTick(() => opener?.focus?.());
}

// Image SEO: expose the gallery as structured data (server-rendered).
useHead(() =>
  images.value.length
    ? {
        script: [
          {
            type: "application/ld+json",
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ImageGallery",
              name: props.blok.heading || undefined,
              associatedMedia: images.value.map((img) => ({
                "@type": "ImageObject",
                contentUrl: img.filename,
                caption: img.title || img.alt || undefined,
              })),
            }),
          },
        ],
      }
    : {},
);
</script>

<style scoped lang="scss">
.gallery {
  &__header {
    margin-bottom: $space-12;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__grid {
    list-style: none;
    padding: 0;
    display: grid;
    gap: $space-4;
    grid-template-columns: 1fr;

    @include respond(sm) {
      grid-template-columns: repeat(2, 1fr);
    }
    @include respond(lg) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__item {
    position: relative;
    margin: 0;
    overflow: hidden;
    border-radius: $radius-lg;
    aspect-ratio: 4 / 3;
  }

  &__trigger {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    @include focus-ring;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms ease;
    .gallery__trigger:hover & {
      transform: scale(1.05);
    }
  }

  &__caption {
    position: absolute;
    inset: auto 0 0 0;
    padding: $space-4;
    background: linear-gradient(0deg, rgba($color-black, 0.8), transparent);
    font-size: $fs-sm;
    font-weight: $fw-medium;
    pointer-events: none;
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
