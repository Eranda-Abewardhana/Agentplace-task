# Application architecture

## Runtime and routes

The app uses the Next.js 16 App Router with TypeScript, Tailwind CSS 4, reusable components, Lucide icons, Framer Motion, React Hook Form, and Zod.

| Route | Purpose | Main implementation |
|---|---|---|
| `/` | SHWASH homepage | `app/page.tsx` |
| `/services` | Verified services and add-ons | `app/services/page.tsx` |
| `/pricing` | Rate matrix and estimator | `app/pricing/page.tsx`, `components/pricing-estimator.tsx` |
| `/assistant` | Progressive assessment and recommendation | `app/assistant/page.tsx`, `components/assistant-consultant.tsx` |
| `/booking` | Locally prepared booking summary and external handoff | `app/booking/page.tsx`, `components/booking-prep.tsx` |
| `POST /api/recommend` | Input validation and deterministic recommendation response | `app/api/recommend/route.ts` |

Shared header, footer, section heading, card/button primitives, and reveal motion live in `components/`. The layout and design tokens are in `app/layout.tsx` and `app/globals.css`.

## Business data and estimates

- `lib/business-data.ts` is the single source of truth for vehicle categories, published rates, service inclusions, add-on prices, plan conditions, and official contact/booking destinations.
- `lib/estimator.ts` validates package/add-on compatibility and performs all arithmetic. Oversized vehicle pricing returns a quote-required result, not a number.
- `lib/recommendation.ts` turns a validated assessment into a service recommendation, selected optional add-ons, an estimate, and explicit scope/coverage caveats.
- `app/api/recommend/route.ts` validates input again on the server before returning the recommendation. Prices and totals are never accepted from the browser.
- The consultant is intentionally a structured decision guide, not a generative language-model integration. Its responses and pricing are predictable and business-data-backed. The Agentplace guide describes how a separate hosted AI agent could be configured, but no such account or connection is present in this repository.

## Booking and payment boundary

The booking page pre-fills only service choices from the internal URL. Customer contact details are kept in React state in the current browser tab. No booking request is submitted from this app and no personal details are sent to `/api/recommend`.

After review, the customer can copy the summary and open `https://book.shwash.co/` in a new tab. No supported prefill format has been verified. The app shows “details collected” and “official booking opened / confirmation pending” only. It cannot read booking confirmation from SHWASH.

The official SHWASH FAQ describes post-service payment, but no payment URL, provider integration, callback, or API has been verified. The app does not collect payment details or mark payment initiated/paid. A future integration must use trusted server-side responses or verified provider callbacks before displaying confirmed or paid states.

## Images

`lib/assets.ts` maps the SHWASH logo, truck, and real interior/exterior service photography. Vehicle silhouettes are official SHWASH pricing assets in `public/images/`. The before/after example on the homepage is a custom illustration labelled as illustrative; it is not a customer result or a promise of outcome.

## State and privacy

- No account, database, analytics, or server-side customer record store is added.
- Booking form inputs stay in the current browser tab. This app never transmits them; the customer re-enters them on SHWASH's external booking site. Copying the summary is an explicit user action.
- Loading, validation error, pending, and post-handoff states stay in component state and are not treated as provider evidence.
- Reduced-motion preferences are respected by reveal animation and global CSS.

## Deployment

Deploy the Next.js app to a compatible Node hosting platform. Set the production origin, run the type/lint/build checks, and verify external navigation from the deployed site. No secrets are required for the current local recommendation engine. The external SHWASH booking site remains independently operated.
