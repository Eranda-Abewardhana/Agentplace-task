# Testing and quality checks

## Automated project checks

Run from the repository root:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

These checks cover lint rules, TypeScript, and the production compilation. The estimate and recommendation are written as pure structured logic to make their data paths reviewable. No separate test framework was added.

## Manual responsive review

Check the homepage, service list, pricing estimator, consultant, and booking preparation at each viewport. Keep the browser viewport at the listed CSS width and verify the document itself does not become horizontally scrollable.

| Width | Main checks |
|---:|---|
| 375px | Menu toggle, hero text, service cards, price inputs, assistant question controls, booking form, no page overflow |
| 390px | Same flow at common iPhone width; visual balance and touch targets |
| 768px | Tablet header, two-column sections, pricing table containment, assistant layout |
| 1024px | Laptop navigation, estimate sidebar, booking summary, image crops |
| 1440px | Full-width hero composition, content max-width, pricing and booking hierarchy |

## Customer-flow checks

1. Load home and follow every navigation link and primary CTA.
2. Visit services; compare interior, combined, exterior-only handoff, and published add-ons.
3. In the estimator, change every vehicle, package, cadence, and add-on; confirm the displayed breakdown changes and is itemized. Interior-only should disable exterior add-ons. Oversized should request a quote.
4. In `/assistant`, test the welcome starters and progress through city/ZIP, each vehicle, each goal, condition/concerns, cadence, and optional budget. Confirm the recommendation matches the goal, includes only relevant add-ons, and has no hand-entered total.
5. Test the API with valid and invalid payloads; invalid input must return HTTP 400.
6. Use assistant/pricing selections to enter booking preparation; verify vehicle/package/cadence/add-ons prefill.
7. Submit an incomplete booking form and confirm each field shows an accessible error. Submit valid details and inspect the summary and copy action.
8. Open the official booking page; confirm the app says confirmation is pending, preserves the summary in the original tab, and does not claim a reservation.
9. Verify the payment panel states payment follows service and that no card inputs or payment success state exist.
10. Check invalid/external-area locations, heavy condition, bio cleaning, pet-hair condition note, and plan minimums.
11. Turn on reduced motion and check page behavior. Use keyboard navigation for menus, selections, details panels, and forms; check focus visibility.

## External integration checks

Booking availability, actual appointment submission/confirmation, payment success/failure, and webhook security cannot be exercised until SHWASH provides its official integration contract and sandbox/live credentials. Do not mark these as passed until they are verified against the external system.

## Results

Verification completed on 2026-11-17 against the production build using headless Chrome.

### Automated project checks

- `npm run lint` — passed.
- `npx tsc --noEmit` — passed.
- `npm run build` — passed. `/booking` prerenders its static shell and streams the URL-prefilled summary behind a Suspense boundary; `/api/recommend` is dynamic.

### Local browser checks

- Homepage, services, pricing, assistant, and booking routes were loaded at 375, 390, 768, 1024, and 1440 CSS pixels: 25 route/viewport pairs, zero horizontal overflow, and zero broken images.
- Mobile menu opened, exposed its five links, navigated to Services, and closed. Internal routes returned HTTP 200; the Home and estimator fragment links reached their targets.
- All 24 published standard-vehicle combinations (3 categories × 2 packages × 4 cadences) matched the structured pricing data.
- Estimator interaction produced $249 for a 5-seat SUV combined monthly detail with $50 pet-hair removal, and $199 after switching to interior-only. Oversized pricing stayed quote-only while showing selected published add-ons separately.
- Consultant flow completed from location through vehicle, goal, condition, concerns, cadence, and budget. Typical pet hair did not automatically add the optional $50 removal; heavy pet hair plus carpet stains returned the two relevant $50 add-ons. Exterior-only recommendations stayed quote-only and flagged conflicting interior concerns.
- Invalid recommendation input returned HTTP 400. Out-of-area locations showed a service-area confirmation note.
- Booking prefill carried vehicle, service, cadence, and applicable add-ons. Exterior-only starts quote-only, has no unsupported add-ons selected, and disables all add-ons; interior-only disables the four exterior add-ons.
- An incomplete booking form showed all seven required errors and marked all seven fields invalid. Valid test details produced a local summary that copied to the clipboard. The official booking CTA points to `https://book.shwash.co/`; clicking it shows “confirmation pending.” The test intercepted the external navigation before loading SHWASH, and no customer details were sent.
- The payment panel states that SHWASH collects payment after service, lists its published methods, and contains no payment form or card inputs. No booking-confirmed or payment-success state is exposed by the client.
- With reduced motion enabled, reveal content remained visible, smooth scrolling was disabled, and the production browser reported no hydration or runtime errors. Keyboard navigation exposed a visible 3px focus ring.

### External integration checks

Actual appointment submission, booking confirmation, payment initiation/completion/failure/cancellation, and provider callbacks remain unverified because SHWASH has not provided an integration contract or sandbox credentials. The tested booking CTA is a verified external handoff; it does not carry the prepared customer details. Payment remains with SHWASH after service, with no direct payment URL or provider callback configured in this application.
