<template>
  <div v-editable="blok">
    <template v-if="blok.sections?.length">
      <StoryblokComponent
        v-for="item in blok.sections"
        :key="item._uid"
        :blok="item"
      />
    </template>

    <!-- Fallback so a project page is never empty before `sections` are added. -->
    <section v-else class="section container project-fallback">
      <h1>{{ blok.title }}</h1>
      <p v-if="blok.cardDescription" class="project-fallback__lead">
        {{ blok.cardDescription }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
// Project detail page (content type `project`), rendered at /projects/<slug>.
// Card fields (title, cardImage, cardDescription) feed the Latest Projects grid;
// `sections` is the detail-page body. SEO is applied by the page via useStorySeo.
defineProps<{ blok: Record<string, any> }>()
</script>

<style scoped lang="scss">
.project-fallback {
  &__lead { color: $color-text-muted; max-width: 60ch; margin-top: $space-4; }
}
</style>
