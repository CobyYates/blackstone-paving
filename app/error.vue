<template>
  <div class="error-page">
    <div class="container error-page__inner">
      <p class="error-page__code">{{ error?.statusCode || 500 }}</p>
      <h1>{{ title }}</h1>
      <p class="error-page__msg">{{ message }}</p>
      <BaseButton @click="handleError">Back to home</BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const title = computed(() =>
  props.error?.statusCode === 404 ? 'Page not found' : 'Something went wrong',
)
const message = computed(() =>
  props.error?.statusCode === 404
    ? "The page you're looking for doesn't exist or has moved."
    : 'Please try again, or head back to the homepage.',
)

// clearError resets the error state and navigates.
const handleError = () => clearError({ redirect: '/' })

useSeoMeta({ title: () => `${title.value} — Blackstone Paving`, robots: 'noindex' })
</script>

<style scoped lang="scss">
.error-page {
  display: grid;
  place-items: center;
  min-height: 70vh;
  text-align: center;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: $space-4;
  }

  &__code {
    font-size: $fs-4xl;
    font-weight: $fw-bold;
    color: $color-primary;
  }

  &__msg {
    color: $color-text-muted;
    max-width: 42ch;
  }
}
</style>
