# SHWASH Mobile Car Detailing

A responsive SHWASH service website with an interactive price estimator, guided detailing consultant, and booking-preparation handoff to SHWASH's official booking application.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Pages

- `/` — brand-led homepage, service overview, process, price preview, FAQs, and calls to action.
- `/services` — verified SHWASH service inclusions and optional add-ons.
- `/pricing` — vehicle-size price matrix and interactive estimate builder.
- `/assistant` — progressive customer assessment with structured service recommendations and published-price estimates.
- `/booking` — booking detail preparation, summary copy, status steps, and the verified SHWASH booking handoff.
- `POST /api/recommend` — validates assessment input and produces a recommendation from the same structured business data used by the pricing UI.

## Verify locally

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Manual responsive and customer-flow checks are documented in [docs/TESTING.md](docs/TESTING.md).

## Pricing and customer data

Published service rates and add-ons live in [`lib/business-data.ts`](lib/business-data.ts); all application estimates are calculated by [`lib/estimator.ts`](lib/estimator.ts). Recommendations never ask a language model to calculate a price. The current consultant is a structured, rules-based guide and does not call an external generative AI service.

Booking contact and vehicle details remain in the browser tab while the customer prepares the summary. The app does not submit them to SHWASH or save them on a server. Customers can copy the summary and continue to [`https://book.shwash.co/`](https://book.shwash.co/). The official booking site has no verified prefill contract available to this app, so the customer re-enters details there and must wait for SHWASH confirmation.

SHWASH says payment is taken after service completion to the customer's satisfaction. This app accepts no card details and does not expose a payment URL or claim payment success. See [docs/BOOKING_AND_PAYMENT_INTEGRATION.md](docs/BOOKING_AND_PAYMENT_INTEGRATION.md).

## External setup

- No API keys or service credentials are required for the local app.
- The official booking link and phone/text contacts are centralized in `lib/business-data.ts`.
- No SHWASH booking API, payment provider, webhook, Agentplace account, or deployment is connected. The Agentplace setup guide describes a separate, manual publishing path and the integration work still needed: [docs/AGENTPLACE_SETUP.md](docs/AGENTPLACE_SETUP.md).

## Design and research

See [docs/BRAND_AND_BUSINESS_RESEARCH.md](docs/BRAND_AND_BUSINESS_RESEARCH.md), [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md), and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Local photos and the logo are public SHWASH assets described by the central map in `lib/assets.ts`.
