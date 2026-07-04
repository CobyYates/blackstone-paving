<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="path"
  />
</template>

<script setup lang="ts">
// Tiny inline-SVG icon set. No icon font (saves ~150KB+ vs @mdi/font).
// Add new glyphs here as <path> markup keyed by name.
const props = withDefaults(
  defineProps<{ name: keyof typeof ICONS; size?: number | string }>(),
  { size: 24 },
)

const ICONS = {
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mail:
    '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  pin:
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  check:
    '<path d="M20 6 9 17l-5-5"/>',
  arrow:
    '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  menu:
    '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  close:
    '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  facebook:
    '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  x:
    '<path d="M4 4l16 16M20 4 4 20"/>',
  linkedin:
    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-13h4v1.5A6 6 0 0 1 16 8z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
} as const

const path = computed(() => ICONS[props.name] ?? '')
</script>

<style scoped lang="scss">
.icon {
  flex: none;
  display: inline-block;
  vertical-align: middle;
}
</style>
