import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CircleHelp } from "lucide-react";
import { PricingEstimator } from "@/components/pricing-estimator";
import { SectionHeading } from "@/components/section-heading";
import { cadences, OFFICIAL, packageDetails, planConditions, publishedPricing, vehicles } from "@/lib/business-data";
import { formatUsd } from "@/lib/estimator";

export const metadata = {
  title: "Mobile Detailing Prices | SHWASH",
  description: "Compare SHWASH one-time and recurring mobile detailing prices by vehicle size, then build a transparent estimate.",
};

function rate(vehicleId: string, service: "full" | "interior", cadence: (typeof cadences)[number]["id"]): string {
  if (vehicleId === "oversized") return "Call for quote";
  return formatUsd(publishedPricing[vehicleId as keyof typeof publishedPricing][service][cadence]);
}

export default function PricingPage() {
  return (
    <main>
      <section className="simple-page-hero"><div className="container simple-page-hero__inner"><p className="eyebrow">Straightforward pricing</p><h1>Know what your detail costs before you book.</h1><p>Choose a vehicle, service, visit frequency, and any optional extras. Your estimate uses SHWASH’s published menu.</p><Link className="button button--primary" href="/assistant">Help me choose a service <ArrowRight size={16} /></Link></div></section>

      <section className="section section--white" id="estimator"><div className="container"><SectionHeading eyebrow="Interactive estimate" title="Build your price, one choice at a time." description="Base rates are set by vehicle size. Add-ons stay optional and are itemized below the estimate." /><PricingEstimator /></div></section>

      <section className="section section--tint"><div className="container"><SectionHeading eyebrow="Published pricing" title="See the full menu by vehicle size." description="These are the one-time and plan rates published by SHWASH. Sprinter and oversized vehicles need a custom quote." />
        <div className="pricing-matrix-wrap"><table className="pricing-matrix"><thead><tr><th>Vehicle</th><th>Service</th><th>One-time</th><th>Monthly</th><th>Every 2 months</th><th>Every 3 months</th></tr></thead><tbody>
          {vehicles.map((vehicle) => ([("full" as const), ("interior" as const)]).map((service) => <tr key={`${vehicle.id}-${service}`}><th scope="row"><div className="matrix-vehicle"><Image src={vehicle.image} alt="" width={76} height={44} /><span>{vehicle.label}</span></div></th><td>{service === "full" ? packageDetails.full.shortName : packageDetails.interior.shortName}</td>{cadences.map((cadence) => <td key={cadence.id}>{rate(vehicle.id, service, cadence.id)}{cadence.id !== "one-time" && vehicle.id !== "oversized" ? <small>per visit</small> : null}</td>)}</tr>))}
        </tbody></table></div>
        <p className="matrix-footnote"><CircleHelp size={15} /> Interior-only pricing is $50 less than the comparable combined one-time visit. Plan rates differ by service and require a minimum of 3 completed visits to retain the discount.</p>
      </div></section>

      <section className="section section--white"><div className="container plan-condition-grid"><div><p className="eyebrow">Service plans</p><h2>Regular care, with the terms in plain view.</h2><p>Monthly, bi-monthly, and quarterly plans have a lower published per-visit rate and priority scheduling. SHWASH says plans have no contracts and can be canceled, with a three-visit minimum to retain discounted pricing.</p><p className="plan-condition-grid__fine">{planConditions}</p><Link className="button button--secondary" href="#estimator">Estimate a plan <ArrowRight size={16} /></Link></div><div className="plan-conditions-card"><span className="plan-conditions-card__number">03</span><div><strong>Completed services to retain the rate</strong><p>If a plan ends before its third completed service, SHWASH may charge back the discount difference on services already received.</p></div><div className="plan-condition-rule" /><div><strong>Price displayed per visit</strong><p>Plan prices in the estimator are for each service visit, not a monthly membership charge.</p></div></div></div></section>

      <section className="section section--dark pricing-cta"><div className="container pricing-cta__inner"><div><p className="eyebrow">Ready to choose?</p><h2>Get a service recommendation that fits your car.</h2><p>The SHWASH consultant can help sort through stains, pet hair, vehicle size, and plan options.</p></div><Link className="button button--primary" href="/assistant">Find my detailing service <ArrowRight size={16} /></Link></div></section>

      <section className="section section--white"><div className="container faq-section"><SectionHeading eyebrow="Price questions" title="A few details before you decide." /><div className="faq-list">
        <details><summary>Are taxes included in these estimates?</summary><p>The online pricing menu does not clearly state tax treatment. Confirm the final total in SHWASH’s official booking flow before completing a reservation.</p></details>
        <details><summary>What if my vehicle is heavily soiled?</summary><p>Tell SHWASH about heavy buildup during booking. Its FAQ says unusually heavy pet hair or long-standing dirt can require an upfront adjustment; the team should confirm any change before starting.</p></details>
        <details><summary>Can I book only an exterior detail?</summary><p>SHWASH says exterior-only detail is available in its official booking page. It does not publish that price in the current marketing menu.</p></details>
        <details><summary>When do I pay?</summary><p>SHWASH says payment is processed after service completion to your satisfaction. This estimator does not take payment or create a payment link.</p></details>
      </div><p className="faq-official-link">Need the official booking flow now? <a href={OFFICIAL.booking} target="_blank" rel="noreferrer">Continue to SHWASH booking <ArrowRight size={14} /></a></p></div></section>
    </main>
  );
}
