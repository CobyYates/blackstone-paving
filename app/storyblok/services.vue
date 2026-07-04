<template>
  <section v-editable="blok" class="services section">
    <div class="container">
      <header v-if="blok.heading || blok.subheading" class="services__header">
        <p v-if="blok.eyebrow" class="eyebrow">{{ blok.eyebrow }}</p>
        <h2 v-if="blok.heading">{{ blok.heading }}</h2>
        <p v-if="blok.subheading" class="services__sub">{{ blok.subheading }}</p>
      </header>
      <ul class="services__grid">
        <li v-for="item in blok.items" :key="item._uid">
          <StoryblokComponent :blok="item" />
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ blok: Record<string, any> }>()
</script>

<style scoped lang="scss">
.services {
  &__header {
    max-width: 640px;
    margin-bottom: $space-12;
    display: flex;
    flex-direction: column;
    gap: $space-3;
  }
  &__sub { color: $color-text-muted; }

  &__grid {
    list-style: none;
    padding: 0;
    display: grid;
    gap: $space-6;
    grid-template-columns: 1fr;

    @include respond(sm) { grid-template-columns: repeat(2, 1fr); }
    @include respond(lg) { grid-template-columns: repeat(4, 1fr); }
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
