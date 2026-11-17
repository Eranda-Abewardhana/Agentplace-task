# Booking and payment integration

Checked against SHWASH's public pages on 17 November 2026. No booking API, payment-provider account, webhook secret, or customer-system credentials were provided or connected.

## Verified official process

- The marketing site's scheduling controls open a modal. Its official booking application is `https://book.shwash.co/`.
- The official booking application is a JavaScript application. No supported query parameter, deep link, import/export, or API contract for pre-populating customer selections was verified.
- SHWASH's official FAQ says customers select vehicle size, service type, and date/time through the online flow, and it says payment is processed after service completion to the customer's satisfaction. It lists major credit cards, debit cards, Apple Pay, and Google Pay.
- The FAQ also says service-plan cards are charged on their billing cycle. The service-plan minimum of three completed services applies to discounted pricing.
- A SHWASH Dallas blog describes optional prepayment and additional payment methods. It does not establish an Austin payment destination or provider. The Austin/official FAQ instructions are used here.

Sources: [official booking](https://book.shwash.co/), [SHWASH pricing and FAQ](https://www.shwash.co/pricing), [Austin service page](https://www.shwash.co/locations/austin-tx), [terms](https://www.shwash.co/terms-of-service), and [Dallas payment article](https://www.shwash.co/blogs/how-can-i-pay-for-mobile-car-detailing-in-dallas-tx).

## Handoff implemented in this app

1. Vehicle, package, cadence, and add-ons can flow from the estimator/consultant to `/booking` as URL selections within this app.
2. The customer enters name, email, phone, address, vehicle details, preferred date/time, and notes. React Hook Form and Zod validate the fields.
3. Those personal details remain in the browser tab. They are not submitted to the app server, database, SHWASH, Agentplace, or payment provider.
4. The page itemizes the selected published price and optional add-ons. Oversized and exterior-only selections are clearly identified as requiring confirmation/quote.
5. A customer can copy the summary and open **Continue to Official Booking**, which opens `https://book.shwash.co/` in a new tab. The official site requires the customer to re-enter details because prefill support has not been verified.
6. The app says that the external booking is pending until SHWASH confirms it. Clicking the link does not set a confirmed state.
7. The app explains that payment occurs after service and gives SHWASH's published payment options. It does not create a payment link or collect card details. No “Proceed to Official Payment” link is exposed because no official Austin payment page/provider was verified and the published sequence is post-service.

## Status handling

| Business state | What this app can show today | Trusted evidence required for a confirmed state |
|---|---|---|
| Service recommendation completed | Local recommendation card | Validated structured assessment and published rate data |
| Booking details collected | Local status; details are in current browser state | Validated form; not a submission |
| Booking request submitted | Not claimed by this app | Accepted request response from SHWASH's official booking system |
| Official booking confirmed | Pending; customer must rely on SHWASH confirmation | Verified booking response or trusted webhook/status API |
| Payment initiated | Not available in this app | Payment-provider/SHWASH response for the actual payment workflow |
| Payment successfully completed | Never set by client-side action | Verified provider event or trusted SHWASH status |
| Payment failed/cancelled | Not available in this app | Verified provider event or trusted SHWASH status |

No current app code can update external booking/payment states. A client-side “I finished” button would not be sufficient evidence, so the UI does not offer one.

## Future integration work

If SHWASH provides official API credentials and workflow documentation:

1. Add a server-only adapter for the official booking API. Keep API keys in deployment environment variables and out of browser bundles.
2. Confirm whether the booking system accepts service, vehicle, add-ons, address, and preferred appointment selections. Send only fields the official contract supports; keep the manual summary handoff for everything else.
3. Create the booking on the server using idempotency support where offered. Display “submitted” only after an accepted response, and “confirmed” only if the system returns that status.
4. Follow SHWASH's actual payment timing. If the service is paid after completion, integrate only the authorized post-service payment workflow; do not create a prepayment path.
5. Validate webhook signatures server-side, reject duplicate or stale events, store event IDs, and update status from trusted server-to-server messages. Never trust query-string, client state, screenshots, or customer statements as payment evidence.
6. Add tests for success, pending, failure, cancellation, duplicate webhook, invalid signature, timeout, and idempotent retry.
7. Document retention, deletion, consent, access controls, and event logging before storing contact details or payment metadata.

## Credentials and environment variables

Current project: none required. There are no SHWASH booking/payment secrets in the browser or repository. If official integration is later supplied, use server-only environment names chosen by SHWASH's actual provider contract; do not guess provider names or add fake URLs.
