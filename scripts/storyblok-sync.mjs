/**
 * Syncs the Storyblok component (block) schemas to match the code in
 * `app/storyblok/` and the content model documented in the README.
 *
 * The CODE is the source of truth: each component below is created if missing,
 * or has its schema replaced if it already exists. It never deletes components
 * and never touches story content - renaming a field only changes the schema,
 * so existing values stored under an old field name become orphaned (expected;
 * see the field-rename note in the README).
 *
 * Usage:
 *   STORYBLOK_MANAGEMENT_TOKEN=xxx STORYBLOK_SPACE_ID=123456 npm run sb:sync
 *   (or put both in .env - this script loads it - then just `npm run sb:sync`)
 *   Add `-- --dry-run` to preview without writing.
 *
 * Token: a Personal Access Token (Account settings) or a Space Management token
 * (Space → Settings → Access tokens → "Management"). NOT the delivery/preview
 * token used by the site at runtime.
 */
import { readFileSync } from 'node:fs'

// --- tiny .env loader (no dependency) ----------------------------------------
try {
  for (const line of readFileSync(new URL('../.env', import.meta.url), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
} catch { /* no .env - rely on real env vars */ }

const TOKEN = process.env.STORYBLOK_MANAGEMENT_TOKEN
const SPACE = process.env.STORYBLOK_SPACE_ID
// EU region (matches apiOptions.region: 'eu'). Override for US: https://api-us.storyblok.com/v1
const BASE = process.env.STORYBLOK_MAPI_BASE || 'https://mapi.storyblok.com/v1'
const DRY = process.argv.includes('--dry-run')

if (!TOKEN || !SPACE) {
  console.error('✗ Set STORYBLOK_MANAGEMENT_TOKEN and STORYBLOK_SPACE_ID (in .env or the shell).')
  process.exit(1)
}

// --- field-type helpers (map README "field type" → Storyblok schema) ---------
const text = (extra = {}) => ({ type: 'text', ...extra })
const textarea = (extra = {}) => ({ type: 'textarea', ...extra })
const richtext = (extra = {}) => ({ type: 'richtext', ...extra })
const boolean = (extra = {}) => ({ type: 'boolean', ...extra })
const asset = (extra = {}) => ({ type: 'asset', filetypes: ['images'], ...extra })
const multiasset = (extra = {}) => ({ type: 'multiasset', filetypes: ['images'], ...extra })
const link = (extra = {}) => ({ type: 'multilink', ...extra })
const bloks = (whitelist, extra = {}) => ({
  type: 'bloks',
  restrict_components: true,
  component_whitelist: whitelist,
  ...extra,
})
// Single-Option (dropdown) with self-defined values.
const option = (values, extra = {}) => ({
  type: 'option',
  options: values.map((v) => (typeof v === 'string' ? { name: v, value: v } : v)),
  ...extra,
})
// Multi story-reference: editors pick published stories (by content type +
// folder). Stored as UUIDs; resolve at fetch time via `resolve_relations`.
const storyRefs = (contentTypes, folderSlug, extra = {}) => ({
  type: 'options',
  source: 'internal_stories',
  filter_content_type: contentTypes,
  folder_slug: folderSlug,
  ...extra,
})

// Assign `pos` from declaration order so the fields render top-to-bottom in Storyblok.
const schema = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v], i) => [k, { ...v, pos: i }]))

// A reusable "button" block used inside `buttons` bloks fields.
const BUTTON_VARIANTS = ['primary', 'outline']

// --- the content model (must mirror app/storyblok/ + README) -----------------
// Leaf/nested blocks first so whitelists reference already-known names (order
// is not strictly required - Storyblok stores whitelists by name - but tidy).
const COMPONENTS = [
  {
    name: 'button',
    display_name: 'Button',
    is_nestable: true,
    schema: schema({
      label: text(),
      link: link(),
      variant: option(BUTTON_VARIANTS, { default_value: 'primary' }),
    }),
  },
  {
    name: 'stat',
    display_name: 'Stat',
    is_nestable: true,
    schema: schema({
      value: text(),
      label: text(),
    }),
  },
  {
    name: 'faqItem',
    display_name: 'FAQ item',
    is_nestable: true,
    schema: schema({
      question: text(),
      answer: richtext(),
    }),
  },
  {
    name: 'formField',
    display_name: 'Form field',
    is_nestable: true,
    schema: schema({
      name: text({ description: 'Also the EmailJS template variable name' }),
      label: text(),
      type: option(['textField', 'email', 'tel', 'textArea', 'select'], { default_value: 'textField' }),
      placeholder: text(),
      required: boolean(),
      width: option(['50%', '100%'], { default_value: '50%' }),
      options: text({ description: 'Comma-separated choices - only for type "select"' }),
    }),
  },
  {
    name: 'serviceCard',
    display_name: 'Service card',
    is_nestable: true,
    schema: schema({
      icon: option(['phone', 'mail', 'pin', 'check', 'arrow', 'plus']),
      image: asset({ description: 'Fallback shown only when icon is empty' }),
      title: text(),
      description: textarea(),
      link: link(),
    }),
  },
  {
    name: 'services',
    display_name: 'Services',
    is_nestable: true,
    schema: schema({
      eyebrow: text(),
      heading: text(),
      subheading: text(),
      items: bloks(['serviceCard']),
    }),
  },
  {
    name: 'feature',
    display_name: 'Feature',
    is_nestable: true,
    schema: schema({
      eyebrow: text(),
      heading: text(),
      text: richtext(),
      image: asset(),
      imagePosition: option(['left', 'right'], { default_value: 'right' }),
      stats: bloks(['stat']),
      buttons: bloks(['button']),
    }),
  },
  {
    name: 'faq',
    display_name: 'FAQ',
    is_nestable: true,
    schema: schema({
      eyebrow: text(),
      heading: text(),
      exclusive: boolean(),
      items: bloks(['faqItem']),
    }),
  },
  {
    name: 'gallery',
    display_name: 'Gallery',
    is_nestable: true,
    schema: schema({
      eyebrow: text(),
      heading: text(),
      images: multiasset(),
    }),
  },
  {
    name: 'cta',
    display_name: 'CTA',
    is_nestable: true,
    schema: schema({
      heading: text(),
      text: text(),
      theme: option(['amber', 'light'], { default_value: 'amber', description: 'amber = filled band; light = white band with amber button' }),
      buttons: bloks(['button']),
    }),
  },
  {
    name: 'contactForm',
    display_name: 'Contact form',
    is_nestable: true,
    schema: schema({
      eyebrow: text(),
      heading: text(),
      description: textarea(),
      anchorId: text({ description: 'Section HTML id (defaults to "contact")' }),
      fields: bloks(['formField']),
      submitLabel: text({ description: 'Defaults to "Send message"' }),
      successMessage: text(),
    }),
  },
  {
    name: 'textBlock',
    display_name: 'Text block',
    is_nestable: true,
    schema: schema({
      content: richtext(),
    }),
  },
  {
    // Homepage "Latest Projects" grid. `projects` references `project` pages
    // from the projects/ folder; resolve them via resolve_relations at fetch.
    name: 'latestProjects',
    display_name: 'Latest projects',
    is_nestable: true,
    schema: schema({
      eyebrow: text(),
      heading: text({ description: 'e.g. "Latest Projects"' }),
      projects: storyRefs(['project'], 'projects/', {
        description: 'Pick project pages from the projects/ folder',
      }),
      viewAllLabel: text({ description: 'Defaults to "View All"' }),
      viewAllLink: link({ description: 'Defaults to the projects/ folder' }),
    }),
  },
  {
    // A single project page under projects/. Card fields feed `latestProjects`;
    // `sections` is the detail-page body.
    name: 'project',
    display_name: 'Project',
    is_root: true,
    is_nestable: false,
    schema: schema({
      title: text(),
      cardImage: asset({ description: 'Thumbnail shown on the Latest Projects card' }),
      cardDescription: textarea({ description: 'Summary shown on the card' }),
      sections: bloks(['hero', 'feature', 'gallery', 'textBlock', 'cta', 'contactForm']),
      seoTitle: text(),
      seoDescription: textarea(),
      ogImage: asset(),
      noIndex: boolean(),
    }),
  },
  {
    name: 'hero',
    display_name: 'Hero',
    is_nestable: true,
    schema: schema({
      eyebrow: text(),
      title: text(),
      subtitle: text(),
      backgroundImage: asset(),
      buttons: bloks(['button']),
      // Rendered inside the hero: stacked below on mobile, to the right on desktop.
      services: bloks(['serviceCard']),
    }),
  },
  {
    name: 'page',
    display_name: 'Page',
    is_root: true,
    is_nestable: false,
    schema: schema({
      sections: bloks(['hero', 'services', 'feature', 'faq', 'gallery', 'cta', 'contactForm', 'textBlock', 'latestProjects']),
      title: text({ description: 'Fallback title if seoTitle is empty' }),
      seoTitle: text(),
      seoDescription: textarea(),
      keywords: text({ description: 'Comma-separated list' }),
      ogImage: asset(),
      noIndex: boolean(),
    }),
  },
]

// --- API plumbing ------------------------------------------------------------
const headers = { Authorization: TOKEN, 'Content-Type': 'application/json' }

async function api(path, opts = {}) {
  const res = await fetch(`${BASE}/spaces/${SPACE}${path}`, { ...opts, headers })
  if (!res.ok) {
    throw new Error(`${opts.method || 'GET'} ${path} → ${res.status} ${res.statusText}\n${await res.text()}`)
  }
  return res.status === 204 ? null : res.json()
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// --- run ---------------------------------------------------------------------
console.log(`→ Storyblok space ${SPACE} @ ${BASE}${DRY ? '  (dry run)' : ''}`)

const { components: existing } = await api('/components/')
const byName = new Map(existing.map((c) => [c.name, c]))

for (const comp of COMPONENTS) {
  const found = byName.get(comp.name)
  const action = found ? 'update' : 'create'
  if (DRY) {
    console.log(`  would ${action}  ${comp.name}  (${Object.keys(comp.schema).length} fields)`)
    continue
  }
  if (found) {
    await api(`/components/${found.id}`, {
      method: 'PUT',
      body: JSON.stringify({ component: { ...comp, id: found.id } }),
    })
    console.log(`  ✓ updated  ${comp.name}`)
  } else {
    await api('/components/', { method: 'POST', body: JSON.stringify({ component: comp }) })
    console.log(`  ✓ created  ${comp.name}`)
  }
  await sleep(200) // be gentle with the MAPI rate limit
}

console.log(DRY ? '✓ dry run complete - nothing written.' : '✓ sync complete.')
