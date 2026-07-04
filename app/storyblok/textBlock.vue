<template>
  <section v-editable="blok" class="rich-text-block section">
    <div class="container rich-text-block__inner">
      <RichText :content="blok.content" />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ blok: Record<string, any> }>()
</script>

<style scoped lang="scss">
.rich-text-block__inner { max-width: 760px; }
</style>
