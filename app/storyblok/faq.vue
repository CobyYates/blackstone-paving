<template>
  <section v-editable="blok" class="faq section">
    <div class="container faq__inner">
      <header class="faq__header">
        <p v-if="blok.eyebrow" class="eyebrow">{{ blok.eyebrow }}</p>
        <h2 v-if="blok.heading">{{ blok.heading }}</h2>
      </header>
      <div class="faq__list">
        <details
          v-for="item in items"
          :key="item._uid"
          v-editable="item"
          class="faq__item"
          :name="blok.exclusive ? 'faq' : undefined"
        >
          <summary class="faq__q">
            <span>{{ item.question }}</span>
            <AppIcon name="plus" :size="20" class="faq__icon" />
          </summary>
          <div class="faq__a">
            <RichText :content="item.answer" />
          </div>
        </details>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ blok: Record<string, any> }>()

const items = computed(() => props.blok.items || [])

// Strip HTML for the JSON-LD answer text.
const toText = (answer: any): string => {
  if (!answer) return ''
  const html = typeof answer === 'string' ? answer : renderRichText(answer)
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

// FAQPage structured data — eligible for rich results in Google.
useSchemaOrg([
  defineWebPage({ '@type': 'FAQPage' }),
  ...items.value.map((item: any) =>
    defineQuestion({ name: item.question, acceptedAnswer: toText(item.answer) }),
  ),
])
</script>

<style scoped lang="scss">
.faq {
  &__inner { max-width: 820px; }
  &__header { text-align: center; margin-bottom: $space-12; }

  &__item {
    border-bottom: 1px solid $color-charcoal;

    &[open] .faq__icon { transform: rotate(45deg); }
  }

  &__q {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    padding: $space-6 0;
    font-weight: $fw-semibold;
    font-size: $fs-lg;
    list-style: none;
    cursor: pointer;
    @include focus-ring;

    &::-webkit-details-marker { display: none; }
  }

  &__icon { color: $color-primary; transition: transform $transition; }

  &__a { padding-bottom: $space-6; color: $color-text-muted; }
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: $fw-semibold;
  color: $color-primary;
  font-size: $fs-sm;
}
</style>
