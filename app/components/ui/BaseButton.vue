<template>
  <!-- Renders a NuxtLink when `to` is set, an <a> for external hrefs, else a <button>. -->
  <component
    :is="tag"
    v-bind="attrs"
    :class="['btn', `btn--${variant}`, { 'btn--block': block }]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    variant?: 'primary' | 'outline' | 'ghost'
    block?: boolean
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', type: 'button' },
)

const tag = computed(() => {
  if (props.to) return resolveComponent('NuxtLink')
  if (props.href) return 'a'
  return 'button'
})

const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href)
    return { href: props.href, rel: 'noopener', target: '_blank' }
  return { type: props.type }
})
</script>

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-2;
  padding: $space-3 $space-6;
  border-radius: $radius-pill;
  border: 2px solid transparent;
  font-weight: $fw-semibold;
  font-size: $fs-base;
  line-height: 1;
  text-decoration: none;
  transition: background-color $transition, color $transition, border-color $transition, transform $transition;
  @include focus-ring;

  &:active { transform: translateY(1px); }

  &--primary {
    background: $color-primary;
    color: $color-primary-contrast;
    &:hover { background: $color-primary-dark; color: $color-primary-contrast; }
  }

  &--outline {
    border-color: $color-primary;
    color: $color-text;
    &:hover { background: $color-primary; color: $color-primary-contrast; }
  }

  &--ghost {
    color: $color-text;
    &:hover { color: $color-primary; }
  }

  &--block { width: 100%; }

  &:disabled { opacity: 0.55; cursor: not-allowed; }
}
</style>
