<template>
  <section v-editable="blok" class="cta" :class="`cta--${blok.theme || 'amber'}`">
    <div class="container cta__inner">
      <div>
        <h2 v-if="blok.heading">{{ blok.heading }}</h2>
        <p v-if="blok.text" class="cta__text">{{ blok.text }}</p>
      </div>
      <div v-if="blok.buttons?.length" class="cta__actions">
        <BaseButton
          v-for="btn in blok.buttons"
          :key="btn._uid"
          :to="btn.link?.cached_url ? `/${btn.link.cached_url.replace(/^\//, '')}` : undefined"
          :href="btn.link?.url && !btn.link?.cached_url ? btn.link.url : undefined"
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
</script>

<style scoped lang="scss">
.cta {
  &__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-8;
    padding-block: $space-16;
  }

  &__text { max-width: 52ch; font-weight: $fw-medium; }

  &__actions { display: flex; gap: $space-4; flex-wrap: wrap; }

  // --- amber band: filled primary background with inverted (dark) buttons ---
  &--amber {
    background: linear-gradient(135deg, $color-primary, $color-primary-dark);
    color: $color-primary-contrast;

    h2 { color: $color-primary-contrast; }
    .cta__text { opacity: 0.9; }

    :deep(.btn--primary) {
      background: $color-black;
      color: $color-white;
      &:hover { background: $color-ink; color: $color-white; }
    }
    :deep(.btn--outline) {
      border-color: $color-black;
      color: $color-black;
      &:hover { background: $color-black; color: $color-white; }
    }
  }

  // --- light band: white background, dark heading, default amber button ---
  &--light {
    background: $color-white;
    color: $color-ink;

    h2 { color: $color-ink; }
    .cta__text { color: $color-text-muted; }
    // buttons keep their default (amber primary) styling
  }
}
</style>
