<template>
  <div v-editable="blok">
    <StoryblokComponent
      v-for="item in blok.sections"
      :key="item._uid"
      :blok="item"
    />
  </div>
</template>

<script setup lang="ts">
// Root content type. Storyblok field: `sections` (blocks). SEO fields (title,
// description, keywords, ogImage, noIndex) are read in the page via useStorySeo.
defineProps<{ blok: Record<string, any> }>()
</script>
