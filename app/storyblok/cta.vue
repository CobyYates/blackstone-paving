<template>
  <section v-editable="blok" class="cta">
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
  background: linear-gradient(135deg, $color-primary, $color-primary-dark);
  color: $color-primary-contrast;

  &__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: $space-8;
    padding-block: $space-16;
  }

  &__text { max-width: 52ch; font-weight: $fw-medium; opacity: 0.9; }

  h2 { color: $color-primary-contrast; }

  &__actions { display: flex; gap: $space-4; flex-wrap: wrap; }

  // Invert button styling on the amber background.
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
</style>
