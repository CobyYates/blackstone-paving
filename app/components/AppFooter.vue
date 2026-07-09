<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__col">
        <NuxtImg
          src="https://a.storyblok.com/f/293630044478648/1553x537/5231357a0f/blackstone-paving-logo.png"
          alt="Blackstone Paving and Construction"
          width="231"
          height="80"
          loading="lazy"
          class="footer__logo"
          provider="storyblok"
        />
        <p class="footer__tag">
          Asphalt paving, removal, fine grading &amp; site management across
          Salt Lake, Utah &amp; Tooele County.
        </p>
        <ul class="footer__social" aria-label="Social media">
          <li>
            <a href="https://facebook.com" rel="noopener" target="_blank" aria-label="Facebook">
              <AppIcon name="facebook" :size="20" />
            </a>
          </li>
          <li>
            <a href="https://x.com" rel="noopener" target="_blank" aria-label="X (Twitter)">
              <AppIcon name="x" :size="20" />
            </a>
          </li>
          <li>
            <a href="https://linkedin.com" rel="noopener" target="_blank" aria-label="LinkedIn">
              <AppIcon name="linkedin" :size="20" />
            </a>
          </li>
        </ul>
      </div>

      <nav class="footer__col" aria-label="Footer">
        <h2 class="footer__heading">Company</h2>
        <ul>
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/our-mission">Our Mission</NuxtLink></li>
          <li><NuxtLink to="/contact">Contact</NuxtLink></li>
        </ul>
      </nav>

      <address class="footer__col footer__contact">
        <h2 class="footer__heading">Get in touch</h2>
        <ul>
          <li>
            <a href="tel:+14355795801"><AppIcon name="phone" :size="18" /> (435) 579-5801</a>
          </li>
          <li>
            <a href="mailto:contact@blackstone-paving.com"><AppIcon name="mail" :size="18" /> contact@blackstone-paving.com</a>
          </li>
          <li>
            <span><AppIcon name="pin" :size="18" /> 3850 Gundersen Cir, Grantsville, UT 84029</span>
          </li>
        </ul>
      </address>
    </div>

    <div class="footer__bar">
      <div class="container">
        <p>© {{ year }} Blackstone Paving and Construction. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<style scoped lang="scss">
.footer {
  background: $color-ink;
  border-top: 1px solid $color-charcoal;
  color: $color-text;

  &__grid {
    display: grid;
    gap: $space-12;
    padding-block: $space-16;
    grid-template-columns: 1fr;

    @include respond(md) {
      grid-template-columns: 2fr 1fr 1.5fr;
    }
  }

  &__logo { height: 40px; width: auto; margin-bottom: $space-4; }
  &__tag { color: $color-text-muted; font-size: $fs-sm; }

  &__heading {
    font-size: $fs-sm;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: $color-primary;
    margin-bottom: $space-4;
  }

  ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: $space-3; }

  &__contact a,
  &__contact span {
    display: inline-flex;
    align-items: center;
    gap: $space-2;
    text-decoration: none;
    color: $color-text;
  }

  &__social {
    flex-direction: row !important;
    gap: $space-4;
    margin-top: $space-6;

    a {
      display: grid;
      place-items: center;
      width: 40px;
      height: 40px;
      border: 1px solid $color-charcoal;
      border-radius: $radius-pill;
      transition: border-color $transition, color $transition;
      &:hover { border-color: $color-primary; color: $color-primary; }
    }
  }

  &__bar {
    border-top: 1px solid $color-charcoal;
    padding-block: $space-6;
    font-size: $fs-sm;
    color: $color-text-muted;
  }
}
</style>
