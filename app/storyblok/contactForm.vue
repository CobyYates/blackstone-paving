<template>
  <section v-editable="blok" class="contact section" :id="blok.anchorId || 'contact'">
    <div class="container contact__grid">
      <div class="contact__intro">
        <p v-if="blok.eyebrow" class="eyebrow">{{ blok.eyebrow }}</p>
        <h2 v-if="blok.heading">{{ blok.heading }}</h2>
        <p v-if="blok.description" class="contact__desc">{{ blok.description }}</p>

        <ul class="contact__details">
          <li><a href="tel:+14355795801"><AppIcon name="phone" :size="18" /> (435) 579-5801</a></li>
          <li><a href="mailto:contact@blackstone-paving.com"><AppIcon name="mail" :size="18" /> contact@blackstone-paving.com</a></li>
          <li><span><AppIcon name="pin" :size="18" /> 3850 Gundersen Cir, Grantsville, UT 84029</span></li>
        </ul>
      </div>

      <!-- After a successful send the form is replaced by this confirmation, so
           the request can't be submitted again. `role="status"` announces it. -->
      <div
        v-if="status === 'success'"
        ref="successPanel"
        class="contact__success"
        role="status"
        tabindex="-1"
      >
        <span class="contact__success-icon" aria-hidden="true">
          <AppIcon name="check" :size="30" />
        </span>
        <h3 class="contact__success-title">Request received</h3>
        <p>{{ blok.successMessage || 'Thanks! We’ll be in touch shortly.' }}</p>
      </div>

      <form v-else class="contact__form" novalidate @submit.prevent="onSubmit">
        <div
          v-for="field in fields"
          :key="field.name"
          class="field"
          :class="{ 'field--full': field.width === '100%' }"
        >
          <label :for="`f-${field.name}`">
            {{ field.label }}<span v-if="field.required" aria-hidden="true"> *</span>
          </label>

          <textarea
            v-if="field.type === 'textArea'"
            :id="`f-${field.name}`"
            v-model="form[field.name]"
            :name="field.name"
            :placeholder="field.placeholder"
            :required="field.required"
            :aria-invalid="!!errors[field.name]"
            rows="5"
          />
          <select
            v-else-if="field.type === 'select'"
            :id="`f-${field.name}`"
            v-model="form[field.name]"
            :name="field.name"
            :required="field.required"
            :aria-invalid="!!errors[field.name]"
          >
            <option value="" disabled>{{ field.placeholder || 'Select…' }}</option>
            <option v-for="opt in options(field.options)" :key="opt" :value="opt">{{ opt }}</option>
          </select>
          <input
            v-else
            :id="`f-${field.name}`"
            v-model="form[field.name]"
            :type="inputType(field.type)"
            :name="field.name"
            :placeholder="field.placeholder"
            :required="field.required"
            :autocomplete="autocomplete(field)"
            :aria-invalid="!!errors[field.name]"
          />

          <p v-if="errors[field.name]" class="field__error">{{ errors[field.name] }}</p>
        </div>

        <!-- Honeypot: bots fill hidden fields; humans don't. -->
        <div class="field--hidden" aria-hidden="true">
          <label for="company-website">Company website</label>
          <input id="company-website" v-model="honeypot" type="text" tabindex="-1" autocomplete="off" />
        </div>

        <div class="field--full">
          <BaseButton type="submit" :variant="'primary'" block :disabled="status === 'sending'">
            {{ status === 'sending' ? 'Sending…' : (blok.submitLabel || 'Send message') }}
          </BaseButton>
        </div>

        <!-- Errors are announced to assistive tech (success replaces the form above). -->
        <p v-if="status === 'error'" class="form-status form-status--err" role="alert">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ blok: Record<string, any> }>()
const config = useRuntimeConfig()

// Default fields if none configured in Storyblok.
const fields = computed<any[]>(() =>
  props.blok.fields?.length
    ? props.blok.fields
    : [
        { name: 'name', label: 'Name', type: 'textField', required: true, width: '50%' },
        { name: 'email', label: 'Email', type: 'email', required: true, width: '50%' },
        { name: 'phone', label: 'Phone', type: 'tel', required: false, width: '50%' },
        { name: 'service', label: 'Service', type: 'select', options: 'Asphalt Paving, Asphalt Removal, Fine Grading, Site Management', width: '50%' },
        { name: 'message', label: 'How can we help?', type: 'textArea', required: true, width: '100%' },
      ],
)

const form = reactive<Record<string, string>>({})
const errors = reactive<Record<string, string>>({})
const honeypot = ref('')
const status = ref<'idle' | 'sending' | 'success' | 'error'>('idle')
const errorMessage = ref('')
const successPanel = ref<HTMLElement | null>(null)

const inputType = (t: string) =>
  ({ email: 'email', tel: 'tel', textField: 'text' } as Record<string, string>)[t] || 'text'

const autocomplete = (f: any) =>
  ({ email: 'email', phone: 'tel', name: 'name' } as Record<string, string>)[f.name] || 'on'

const options = (val?: string) =>
  (val || '').split(',').map((s) => s.trim()).filter(Boolean)

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  for (const f of fields.value) {
    const v = (form[f.name] || '').trim()
    if (f.required && !v) errors[f.name] = 'This field is required.'
    else if (f.type === 'email' && v && !emailRe.test(v)) errors[f.name] = 'Enter a valid email address.'
  }
  return Object.keys(errors).length === 0
}

async function onSubmit() {
  // Honeypot: the hidden "company website" field is invisible to humans. If it's
  // filled, it's a bot - bail out silently and never send.
  if (honeypot.value) return
  // Guard against a re-submit if somehow triggered after success.
  if (status.value === 'success' || status.value === 'sending') return
  if (!validate()) return

  const serviceId = config.public.emailjsServiceId as string
  const templateId = config.public.emailjsTemplateId as string
  const publicKey = config.public.emailjsPublicKey as string

  if (!serviceId || !templateId || !publicKey) {
    status.value = 'error'
    errorMessage.value = 'The form isn’t configured yet. Please call us at (435) 579-5801.'
    return
  }

  status.value = 'sending'
  try {
    // Lazy-load EmailJS only when the user submits (keeps it out of SSR + first load).
    const { default: emailjs } = await import('@emailjs/browser')
    await emailjs.send(serviceId, templateId, { ...form }, { publicKey })
    status.value = 'success'
    Object.keys(form).forEach((k) => (form[k] = ''))
    // Move focus to the confirmation so keyboard/SR users aren't left on the
    // now-removed submit button.
    nextTick(() => successPanel.value?.focus())
  } catch (err) {
    console.error('EmailJS send failed:', err)
    status.value = 'error'
    errorMessage.value = 'Something went wrong sending your message. Please try again or call us.'
  }
}
</script>

<style scoped lang="scss">
.contact {
  background: $color-surface;

  &__grid {
    display: grid;
    gap: $space-16;
    grid-template-columns: 1fr;
    @include respond(md) { grid-template-columns: 1fr 1.2fr; }
  }

  &__intro { display: flex; flex-direction: column; gap: $space-4; }
  &__desc { color: $color-text-muted; }

  &__details {
    list-style: none;
    padding: 0;
    margin-top: $space-4;
    display: flex;
    flex-direction: column;
    gap: $space-3;

    a, span { display: inline-flex; align-items: center; gap: $space-2; text-decoration: none; }
  }

  &__form {
    display: grid;
    gap: $space-4;
    grid-template-columns: repeat(2, 1fr);
    align-content: start;
  }

  &__success {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: $space-4;
    padding: $space-8;
    background: rgba($color-success, 0.1);
    border: 1px solid rgba($color-success, 0.3);
    border-radius: $radius-lg;
    outline: none; // programmatic focus target; role="status" announces it

    p { color: $color-text-muted; }
  }
  &__success-icon {
    display: grid;
    place-items: center;
    width: 56px;
    height: 56px;
    border-radius: $radius-pill;
    background: rgba($color-success, 0.18);
    color: $color-success;
  }
  &__success-title { font-size: $fs-lg; }
}

.field {
  display: flex;
  flex-direction: column;
  gap: $space-2;

  &--full { grid-column: 1 / -1; }
  &--hidden { position: absolute; left: -9999px; }

  label { font-size: $fs-sm; font-weight: $fw-medium; }

  input, textarea, select {
    width: 100%;
    padding: $space-3 $space-4;
    background: $color-black;
    border: 1px solid $color-charcoal;
    border-radius: $radius-sm;
    color: $color-text;
    transition: border-color $transition;
    @include focus-ring;

    &:focus { border-color: $color-primary; }
    &[aria-invalid='true'] { border-color: $color-error; }
    &::placeholder { color: $color-gray; }
  }

  &__error { color: $color-error; font-size: $fs-xs; }
}

.form-status {
  grid-column: 1 / -1;
  padding: $space-3 $space-4;
  border-radius: $radius-sm;
  font-size: $fs-sm;

  &--ok  { background: rgba($color-success, 0.15); color: $color-success; }
  &--err { background: rgba($color-error, 0.15); color: $color-error; }
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: $fw-semibold;
  color: $color-primary;
  font-size: $fs-sm;
}
</style>
