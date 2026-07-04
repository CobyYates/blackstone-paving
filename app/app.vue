<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Site-wide default meta. Per-page values (title, description, canonical, OG)
// are set with useSeoMeta() inside each page and merged over these.
useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Blackstone Paving and Construction',
  twitterCard: 'summary_large_image',
})
</script>
