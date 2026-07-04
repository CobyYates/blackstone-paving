<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <AppHeader />
  <main id="main" role="main">
    <slot />
  </main>
  <AppFooter />
</template>

<script setup lang="ts">
// AppHeader / AppFooter are auto-imported from app/components.
</script>
