<template>
  <component
    :is="blok.link?.cached_url || blok.link?.url ? NuxtLink : 'div'"
    v-editable="blok"
    class="service-card"
    :to="to"
  >
    <span v-if="icon" class="service-card__icon" aria-hidden="true">
      <AppIcon :name="icon" :size="28" />
    </span>
    <NuxtImg
      v-else-if="blok.image?.filename"
      :src="blok.image.filename"
      :alt="blok.image.alt || ''"
      width="56"
      height="56"
      class="service-card__img"
      loading="lazy"
      provider="storyblok"
    />
    <h3 class="service-card__title">{{ blok.title }}</h3>
    <p class="service-card__desc">{{ blok.description }}</p>
  </component>
</template>

<script setup lang="ts">
const props = defineProps<{ blok: Record<string, any> }>()
const NuxtLink = resolveComponent('NuxtLink')

// Icon name maps to the AppIcon set (falls back to none if unmatched).
const KNOWN_ICONS = ['phone', 'mail', 'pin', 'check', 'arrow', 'plus'] as const
const icon = computed(() =>
  props.blok.icon && KNOWN_ICONS.includes(props.blok.icon) ? props.blok.icon : null,
)

const to = computed(() => {
  const l = props.blok.link
  if (!l) return undefined
  if (l.url) return l.url
  if (l.cached_url) return `/${String(l.cached_url).replace(/^\//, '')}`
  return undefined
})
</script>

<style scoped lang="scss">
.service-card {
  display: flex;
  flex-direction: column;
  gap: $space-3;
  height: 100%;
  padding: $space-8;
  background: $color-surface;
  border: 1px solid $color-charcoal;
  border-radius: $radius-lg;
  text-decoration: none;
  color: $color-text;
  transition: border-color $transition, transform $transition;

  &:hover {
    border-color: $color-primary;
    transform: translateY(-4px);
  }

  &__icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: $radius;
    background: rgba($color-primary, 0.12);
    color: $color-primary;
  }

  &__title { font-size: $fs-lg; }
  &__desc { color: $color-text-muted; font-size: $fs-sm; }
}
</style>
