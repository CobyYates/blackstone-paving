<template>
  <div v-editable="blok">
    <StoryblokComponent
      v-for="item in blok.body"
      :key="item._uid"
      :blok="item"
    />
  </div>
</template>

<script setup lang="ts">
// Root content type. Storyblok field: `body` (blocks). SEO fields (title,
// description, keywords, og_image, no_index) are read in the page via useStorySeo.
defineProps<{ blok: Record<string, any> }>()
</script>
