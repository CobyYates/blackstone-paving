<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
</template>

<script setup lang="ts">
// Catch-all: renders any Storyblok page by its full slug (e.g. /contact, /our-mission).
const route = useRoute()

// route.params.slug is a string[] for catch-all routes; join back to a slug.
const slug = (Array.isArray(route.params.slug)
  ? route.params.slug.join('/')
  : route.params.slug) || 'home'

const story = await useStory(slug)
useStorySeo(story.value?.content)
</script>
