<template>
  <div class="rich-text" v-html="html" />
</template>

<script setup lang="ts">
// Renders a Storyblok richtext field to HTML. `renderRichText` is auto-imported
// by @storyblok/nuxt. Accepts a richtext doc or a plain string.
const props = defineProps<{ content: any }>()

const html = computed(() => {
  if (!props.content) return ''
  if (typeof props.content === 'string') return props.content
  return renderRichText(props.content)
})
</script>

<style scoped lang="scss">
.rich-text {
  color: $color-text;
  line-height: $lh-base;

  :deep(h2), :deep(h3), :deep(h4) { margin-block: $space-8 $space-4; }
  :deep(p) { margin-bottom: $space-4; }
  :deep(ul), :deep(ol) { margin: 0 0 $space-4 $space-6; }
  :deep(li) { margin-bottom: $space-2; }
  :deep(a) { color: $color-primary; }
  :deep(img) { border-radius: $radius; margin-block: $space-6; }
  :deep(blockquote) {
    border-left: 3px solid $color-primary;
    padding-left: $space-4;
    color: $color-text-muted;
    font-style: italic;
  }
}
</style>
