<template>
  <StoryblokComponent v-if="story" :blok="story.content" />
</template>

<script setup lang="ts">
// Homepage → Storyblok story with slug "home".
const story = await useStory('home')
useStorySeo(story.value?.content)
</script>
