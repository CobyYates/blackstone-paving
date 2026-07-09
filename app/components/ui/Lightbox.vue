<template>
  <dialog
    ref="dialog"
    class="lightbox"
    aria-label="Image gallery"
    @close="emit('close')"
    @click="onBackdrop"
    @keydown="onKeydown"
  >
    <div class="lightbox__inner" @click.stop>
      <button
        type="button"
        class="lightbox__btn lightbox__close"
        aria-label="Close gallery"
        @click="close"
      >
        <AppIcon name="close" :size="24" />
      </button>

      <button
        v-if="images.length > 1"
        type="button"
        class="lightbox__btn lightbox__nav lightbox__nav--prev"
        aria-label="Previous image"
        @click="prev"
      >
        <AppIcon name="arrow" :size="28" />
      </button>

      <figure
        class="lightbox__figure"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <NuxtImg
          :key="current.filename"
          :src="current.filename"
          :alt="current.alt || current.title || `Image ${index + 1} of ${images.length}`"
          sizes="xs:100vw sm:100vw md:90vw lg:85vw xl:1100px"
          class="lightbox__img"
          provider="storyblok"
        />
        <figcaption v-if="current.title" class="lightbox__caption">
          {{ current.title }}
        </figcaption>
      </figure>

      <button
        v-if="images.length > 1"
        type="button"
        class="lightbox__btn lightbox__nav lightbox__nav--next"
        aria-label="Next image"
        @click="next"
      >
        <AppIcon name="arrow" :size="28" />
      </button>

      <!-- Live region: announces the current image to assistive tech on change. -->
      <p class="lightbox__counter" role="status" aria-live="polite">
        {{ index + 1 }} of {{ images.length }}<template v-if="current.title"> - {{ current.title }}</template>
      </p>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{ images: any[]; startIndex?: number }>(),
  { startIndex: 0 },
)
const emit = defineEmits<{ close: [] }>()

const dialog = ref<HTMLDialogElement>()
const index = ref(props.startIndex)
const current = computed(() => props.images[index.value] || {})

const next = () => (index.value = (index.value + 1) % props.images.length)
const prev = () =>
  (index.value = (index.value - 1 + props.images.length) % props.images.length)

// close() drives the native dialog; its `close` event emits to the parent so
// keyboard (Esc), the button, and backdrop all funnel through one path.
const close = () => dialog.value?.close()

const onKeydown = (e: KeyboardEvent) => {
  if (props.images.length < 2) return
  if (e.key === 'ArrowRight') { e.preventDefault(); next() }
  else if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
}

const onBackdrop = (e: MouseEvent) => {
  if (e.target === dialog.value) close()
}

// Touch swipe (mobile): horizontal drag past a small threshold flips image.
let startX = 0
const onTouchStart = (e: TouchEvent) => (startX = e.changedTouches[0].clientX)
const onTouchEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - startX
  if (props.images.length > 1 && Math.abs(dx) > 40) (dx < 0 ? next : prev)()
}

onMounted(() => {
  dialog.value?.showModal() // native focus trap + ::backdrop + Esc handling
  document.documentElement.style.overflow = 'hidden' // lock background scroll
})
onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
})
</script>

<style scoped lang="scss">
.lightbox {
  width: 100vw;
  height: 100dvh;
  max-width: 100vw;
  max-height: 100dvh;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: $color-white;

  &::backdrop { background: rgba($color-black, 0.92); }

  &__inner {
    position: relative;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    padding: $space-4;
  }

  &__figure {
    margin: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-4;
    max-width: min(1100px, 92vw);
  }

  &__img {
    max-width: 100%;
    max-height: 80dvh;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: $radius;

    @media (prefers-reduced-motion: no-preference) {
      animation: lightbox-fade 200ms ease;
    }
  }

  &__caption {
    font-size: $fs-sm;
    color: $color-gray-light;
    text-align: center;
    max-width: 60ch;
  }

  &__btn {
    display: grid;
    place-items: center;
    background: rgba($color-white, 0.1);
    color: $color-white;
    border: 1px solid rgba($color-white, 0.25);
    border-radius: $radius-pill;
    cursor: pointer;
    transition: background-color $transition;
    @include focus-ring;

    &:hover { background: rgba($color-white, 0.22); }
  }

  &__close {
    position: absolute;
    top: $space-4;
    right: $space-4;
    width: 44px;
    height: 44px;
  }

  &__nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;

    &--prev { left: $space-4; }
    &--prev :deep(.icon) { transform: rotate(180deg); }
    &--next { right: $space-4; }
  }

  &__counter {
    position: absolute;
    bottom: $space-4;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    font-size: $fs-sm;
    color: $color-gray-light;
    background: rgba($color-black, 0.5);
    padding: $space-2 $space-4;
    border-radius: $radius-pill;
    white-space: nowrap;
    max-width: 90vw;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@keyframes lightbox-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
