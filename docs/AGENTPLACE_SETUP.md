# Agentplace setup

This repository does not have an Agentplace account, published Agentplace agent, connected integration, or Agentplace credentials. The website's `/assistant` route is a structured, rules-based guided consultant; this document describes the separate setup required to create and publish a generative SHWASH agent in Agentplace.

Agentplace's builder can use an existing website plus uploaded business knowledge. Its documentation says uploaded knowledge is not necessarily a live feed, so pricing updates must be refreshed or connected to a trusted source. See [create your first agent](https://agentplace.io/docs/getting-started/create-your-first-agent), [add business knowledge](https://agentplace.io/docs/building/add-business-knowledge), and [test and refine](https://agentplace.io/docs/building/test-and-refine).

## Create the agent

1. Sign in to the SHWASH-owned Agentplace workspace and choose the flow to create an agent from an existing website.
2. Provide `https://www.shwash.co/`, `https://www.shwash.co/pricing`, and `https://www.shwash.co/locations/austin-tx` as public source pages.
3. Upload or paste `docs/BRAND_AND_BUSINESS_RESEARCH.md`, `docs/AGENT_SYSTEM_PROMPT.md`, and the structured rates from `lib/business-data.ts`.
4. Tell the Builder that the live pricing pages and the current structured business-data file are authoritative for prices. If they conflict, stop, flag the conflict for SHWASH, and do not publish a guessed value.
5. Ask for the mobile service-consultant experience: location, vehicle, goal, condition/concerns, one-time/recurring cadence, optional budget, recommendation card, itemized estimate, and official booking handoff.
6. Disable collection of payment information and avoid cross-session memory or customer records unless SHWASH separately approves and configures a privacy-reviewed workflow.

## Connect tools only after they exist

No appointment API, availability endpoint, payment provider, webhook, or Agentplace integration is configured in this repo. The official booking destination is `https://book.shwash.co/`, but no supported prefill format is available. Add a link action only; label it as an external handoff, and don't say customer details were transferred.

The current `POST /api/recommend` endpoint is intended for the same-origin Next.js application. It has no Agentplace server-to-server credential or cross-origin integration. Before connecting an external Agentplace tool, add an authenticated server route or tool adapter, restrict access, validate the payload, add rate limiting/monitoring, and return the structured estimator result. Do not expose a shared secret in browser code. Use the exact returned totals; do not let the agent calculate them.

If SHWASH later provides booking integration, document the official API and authorized status source first. Booking confirmed, payment initiated, payment completed, payment failed, and cancelled states must come from verified SHWASH/provider responses. No tool should return those states based on agent text or a customer assertion.

## Preview and test

Test whole customer tasks, including a typical sedan, SUV, interior-only with seat stains, pet hair, heavy buildup, exterior-only, oversized vehicle, an out-of-area ZIP, a budget mismatch, and a plan customer who has not accepted the three-visit term. Also test a customer asking for a payment link or saying “I already booked.” The agent should explain the verified process and preserve pending/unconfirmed state.

Check the price, package scope, caveats, mobile layout, action result, missing-information behavior, and customer handoff. Agentplace's preview is not proof that a real booking or payment occurred; verify connected actions in the actual system. Agentplace recommends previewing complete customer tasks and testing the published URL after release.

## Publish

1. Review the knowledge, permitted actions, privacy, and access policy.
2. Publish only after SHWASH reviews the preview and the test cases above pass.
3. Set the intended public/restricted/private access, sign-in, and duplication options in the Agentplace publishing flow.
4. Test the copied published URL as an anonymous customer if that is the intended audience.
5. Add that published Agentplace URL to the SHWASH website only after the external agent is actually published and verified.

Agentplace describes the published agent as its own hosted URL; a connected custom domain is a separate setup. See [publishing and sharing](https://agentplace.io/docs/publishing/publish-and-share). No publication or domain connection has been completed in this project.
