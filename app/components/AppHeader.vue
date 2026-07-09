<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <div class="container header__inner">
      <NuxtLink
        to="/"
        class="header__brand"
        aria-label="Blackstone Paving - home"
      >
        <NuxtImg
          src="https://a.storyblok.com/f/293630044478648/1553x537/5231357a0f/blackstone-paving-logo.png"
          alt="Blackstone Paving and Construction"
          width="208"
          height="72"
          loading="eager"
          fetchpriority="high"
          provider="storyblok"
        />
      </NuxtLink>

      <button
        class="header__toggle"
        :aria-expanded="open"
        aria-controls="primary-nav"
        aria-label="Toggle navigation menu"
        @click="open = !open"
      >
        <AppIcon :name="open ? 'close' : 'menu'" />
      </button>

      <nav
        id="primary-nav"
        class="header__nav"
        :class="{ 'is-open': open }"
        aria-label="Primary"
      >
        <ul>
          <li v-for="link in links" :key="link.to">
            <NuxtLink :to="link.to" @click="open = false">
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
// Static site chrome. Swap `links` for a Storyblok "navigation" story if you
// want editors to control the menu - keep the markup and a11y attributes.
const links = [
  { label: "Home", to: "/" },
  { label: "Our Mission", to: "/our-mission" },
  { label: "Contact", to: "/contact" },
];

const open = ref(false);
const scrolled = ref(false);

const onScroll = () => (scrolled.value = window.scrollY > 20);
onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));

// Close the mobile menu on route change.
watch(
  () => useRoute().fullPath,
  () => (open.value = false),
);
</script>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: $z-header;
  background: rgba($color-black, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid transparent;
  transition:
    border-color $transition,
    background-color $transition;

  &--scrolled {
    border-bottom-color: $color-charcoal;
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-4;
    min-height: 68px;
  }

  &__brand img {
    height: 36px;
    width: auto;
  }

  &__toggle {
    display: inline-flex;
    background: none;
    border: 0;
    color: $color-text;
    padding: $space-2;
    @include respond(md) {
      display: none;
    }
  }

  &__nav {
    // Mobile: collapsible panel
    position: absolute;
    inset: 68px 0 auto 0;
    background: $color-ink;
    flex-direction: column;
    gap: $space-4;
    padding: $space-6 $container-pad;
    display: none;
    border-bottom: 1px solid $color-charcoal;

    &.is-open {
      display: flex;
    }

    ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: $space-4;
    }

    a {
      font-weight: $fw-medium;
      text-decoration: none;
    }

    // Desktop: inline row
    @include respond(md) {
      position: static;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0;
      background: none;
      border: 0;

      ul {
        flex-direction: row;
        gap: $space-8;
      }
    }
  }

  &__cta {
    white-space: nowrap;
  }
}
</style>
