# EmailJS template - contact / quote form

The contact form (`app/storyblok/contactForm.vue`) submits with EmailJS:

```js
emailjs.send(serviceId, templateId, { ...form }, { publicKey })
```

`form` is keyed by each field's **`name`**, so the template variables are exactly:

| Variable | From field | Required | Notes |
|---|---|---|---|
| `{{name}}`    | Name    | yes | |
| `{{email}}`   | Email   | yes | Use as **Reply-To** so you can reply to the customer |
| `{{phone}}`   | Phone   | no  | May be blank |
| `{{service}}` | Service | no  | One of: Asphalt Paving, Asphalt Removal, Fine Grading, Site Management |
| `{{message}}` | Message | yes | |

> If you add or rename fields in the Storyblok `contactForm` → `formField` blocks,
> the variable names change to match the new field `name`s - update this template
> to match. The honeypot field is never sent, so it needs no variable.

---

## 1. Template settings (EmailJS dashboard → Email Templates → your template)

| Setting | Value |
|---|---|
| **To Email** | `contact@blackstone-paving.com` |
| **From Name** | `{{name}}` (shows the customer's name in your inbox) |
| **From Email** | *your verified service sender* (leave as the service default) |
| **Reply To** | `{{email}}` ← **important**: lets you reply straight to the customer |
| **Subject** | `New quote request from {{name}}` |

The template id you create here goes in `.env` as `NUXT_PUBLIC_EMAILJS_TEMPLATE_ID`
(and in the Cloudflare Pages env).

---

## 2. Content - HTML

Paste into the template's HTML/code editor. Inline styles only (email-client safe).

```html
<div style="font-family: Arial, Helvetica, sans-serif; color:#1a1a1a; line-height:1.5; max-width:600px; margin:0 auto;">
  <div style="background:#111111; padding:20px 24px; border-radius:8px 8px 0 0;">
    <h1 style="margin:0; font-size:18px; color:#f2a516;">Blackstone Paving &amp; Construction</h1>
    <p style="margin:4px 0 0; font-size:13px; color:#cccccc;">New quote request from the website</p>
  </div>

  <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse; border:1px solid #eee; border-top:0;">
    <tr>
      <td style="padding:12px 24px; font-weight:bold; width:110px; border-bottom:1px solid #f0f0f0;">Name</td>
      <td style="padding:12px 24px; border-bottom:1px solid #f0f0f0;">{{name}}</td>
    </tr>
    <tr>
      <td style="padding:12px 24px; font-weight:bold; border-bottom:1px solid #f0f0f0;">Email</td>
      <td style="padding:12px 24px; border-bottom:1px solid #f0f0f0;"><a href="mailto:{{email}}" style="color:#b26a00;">{{email}}</a></td>
    </tr>
    <tr>
      <td style="padding:12px 24px; font-weight:bold; border-bottom:1px solid #f0f0f0;">Phone</td>
      <td style="padding:12px 24px; border-bottom:1px solid #f0f0f0;">{{phone}}</td>
    </tr>
    <tr>
      <td style="padding:12px 24px; font-weight:bold; border-bottom:1px solid #f0f0f0;">Service</td>
      <td style="padding:12px 24px; border-bottom:1px solid #f0f0f0;">{{service}}</td>
    </tr>
    <tr>
      <td style="padding:12px 24px; font-weight:bold; vertical-align:top;">Message</td>
      <td style="padding:12px 24px; white-space:pre-wrap;">{{message}}</td>
    </tr>
  </table>

  <p style="margin:16px 24px; font-size:12px; color:#888888;">
    Sent from blackstone-paving.com · Reply to this email to respond to {{name}} directly.
  </p>
</div>
```

---

## 3. Content - plain text (fallback / if you prefer text-only)

```
New quote request - blackstone-paving.com

Name:    {{name}}
Email:   {{email}}
Phone:   {{phone}}
Service: {{service}}

Message:
{{message}}

--
Reply to this email to respond to {{name}} directly.
```

---

## 4. Optional: auto-reply to the customer

A second EmailJS template that confirms receipt. **To Email = `{{email}}`**,
Subject `We got your request - Blackstone Paving`:

```html
<div style="font-family: Arial, Helvetica, sans-serif; color:#1a1a1a; line-height:1.6; max-width:600px; margin:0 auto;">
  <p>Hi {{name}},</p>
  <p>
    Thanks for reaching out to <strong>Blackstone Paving &amp; Construction</strong>.
    We've received your request and will get back to you shortly with a free estimate.
  </p>
  <p>If it's urgent, call us at <a href="tel:+14355795801" style="color:#b26a00;">(435) 579-5801</a>.</p>
  <p style="margin-top:24px;">- The Blackstone Paving team</p>
  <hr style="border:0; border-top:1px solid #eee; margin:24px 0;" />
  <p style="font-size:12px; color:#888;">
    3850 Gundersen Cir, Grantsville, UT 84029 · (435) 579-5801 · contact@blackstone-paving.com
  </p>
</div>
```

> The current form sends **one** email (to the business). To also send this
> auto-reply, the form needs a second `emailjs.send(...)` call with this second
> template's id. Ask and I'll wire it up (plus an `NUXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID`).
