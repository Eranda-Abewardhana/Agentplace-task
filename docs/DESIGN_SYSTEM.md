# SHWASH application design system

This system carries the public SHWASH aqua/navy identity into a more editorial service experience. It is grounded in the current SHWASH website and its public Webflow stylesheet; see [brand research](./BRAND_AND_BUSINESS_RESEARCH.md).

## Visual direction

**Clean, confident, and hands-on.** Treat the vehicle and the quality of the work as the subject. Use composed automotive photos with deep shadows and natural paint reflections, generous white space, firm typography, short copy, and a few precise aqua highlights. The interface should feel like a polished service brand and a reliable booking companion, not a software dashboard.

## Color tokens

| Token | Value | Use |
|---|---|---|
| `--brand-aqua` | `#39BCBC` | Primary buttons, selected states, brand markers |
| `--brand-aqua-deep` | `#176C72` | High-contrast aqua text, hover/focus states, and selected controls |
| `--brand-aqua-soft` | `#E8F7F7` | Light selection, badge, and icon backgrounds |
| `--ink` | `#101828` | Main text, dark surfaces, navigation |
| `--ink-muted` | `#475467` | Supporting text |
| `--canvas` | `#FFFFFF` | Main page canvas |
| `--surface` | `#F7F9FA` | Alternating content areas and subtle panels |
| `--line` | `#D9DEE6` | Dividers and control borders |
| `--success` | `#027A48` | Verified/ready status only |
| `--warning` | `#B54708` | Pending external confirmation |
| `--danger` | `#B42318` | Form and handoff errors |

SHWASH's public stylesheet also uses `#33A0AB`. The app uses `#176C72` as a darker, contrast-adjusted text and control shade in the same aqua family; the primary button fill and official wordmark retain the brighter brand aqua.

Use aqua for important actions and selected states, not body copy on white. Body copy stays dark enough for accessible contrast. Use navy rather than black for most text and dark sections.

## Typography

- **Family:** Inter first, then system UI fallbacks. SHWASH's public stylesheet uses Proxima Nova and Inter; the app keeps an Inter-led system stack without shipping an unverified font license.
- **Display:** Heavy/semibold grotesk, tight leading, modest negative tracking. Use an editorial line break on large desktop headings; keep headline width controlled on mobile.
- **Body:** 16px base with 1.55–1.7 line height. Use short paragraphs and concise labels.
- **Labels:** 12–13px medium/semibold, sentence case, modest tracking. Avoid all-caps microcopy except small section labels.
- **Numeric prices:** Tabular numerals and a consistent scale. Show `/ visit` for plan prices.

## Layout and spacing

- Main content max width: `1200px`; text measure: `650–720px`.
- Desktop side padding: `40–56px`; tablet: `28–32px`; mobile: `20px`.
- Spacing follows a 4px base, with common steps at 8, 12, 16, 24, 32, 48, 64, 88, and 112px.
- Hero uses a wide image with a dark readability overlay and a compact trust/pricing panel. Keep core CTAs visible without scrolling on desktop; stack them on mobile.
- Build sections with clear vertical rhythm. Use photography edge-to-edge only where it adds impact; use rounded corners sparingly.
- Breakpoints target mobile (under 640px), tablet (640–1023px), and desktop (1024px+). Responsive layouts reflow, not merely scale.

## Components and treatments

- **Wordmark:** Use the official aqua SHWASH logo asset on light surfaces. On dark surfaces use the same wordmark only if contrast remains clear; otherwise render the text wordmark in white and retain the brand aqua mark.
- **Buttons:** 48px minimum height, 6–8px radius, semibold text, clear focus ring. Primary is aqua/dark-aqua with high-contrast text; secondary is white with navy text and a fine border; text actions are underlined on hover/focus. A booking CTA always names the official handoff.
- **Cards:** White or `--surface`, 1px border, 8–12px radius, little or no shadow. Highlight a single recommended/selected choice with a fine aqua outline.
- **Inputs:** 48px height where practical, visible label above, concise helper text, explicit error text, 6px radius. Selections have check/radio semantics and visible selected state.
- **Badges:** Compact pills for plan cadence, price condition, and status. Do not use a green success state until an external provider verifies success.
- **Icons:** Lucide outline icons at 16–22px, consistent stroke width. Icons support text rather than replace important labels.
- **Images:** Editorial automotive photo treatment, natural light/reflections, restrained crop, rounded corners no larger than 12px. Use responsive Next Image sizing. Avoid repeating one photo across all sections. Any non-SHWASH portfolio examples are identified as illustrative.
- **Motion:** Short opacity/position transitions for opening cards and step changes. Respect `prefers-reduced-motion`; no parallax or attention-grabbing loops.

## Responsive patterns

- Mobile navigation switches to a compact menu with touch-sized links.
- Price comparison becomes a selected-vehicle estimator and vertically stacked plan rows; it does not shrink a wide table.
- Assistant choices become full-width buttons, the conversation uses the viewport without horizontal overflow, and its composer remains reachable.
- Booking summary cards stack into a single column. The external handoff and payment timing remain visible before the customer leaves.
- All contact, booking, and estimator actions remain finger-sized and keyboard accessible.

## Image roles

The app uses SHWASH's public brand assets for the logo, mobile trucks, in-progress interior/exterior service photography, and vehicle-category images. They are copied into `public/images/` for stable local image optimization and mapped from `lib/assets.ts`. These real SHWASH images are preferred over stock shots where an image depicts SHWASH staff, vehicles, or work. The only before/after-style visual is a custom illustration with a clear disclosure; it is not presented as a customer result. Never use a stock person or van in a way that suggests they are SHWASH staff/assets. Any future Unsplash/Pexels illustration must be mapped centrally and labeled when it could be mistaken for a SHWASH job.

## Interaction language

- Prefer direct phrases: “Choose a vehicle,” “See the estimate,” “Copy booking summary,” and “Continue to Official Booking.”
- A price is an estimate until the official booking flow confirms scope and appointment.
- Make the difference between “prepared here” and “confirmed by SHWASH” explicit.
- Payment is shown as due after service unless SHWASH's official system presents another option; this app never collects card details.
