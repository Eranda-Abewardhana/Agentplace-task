import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, CircleHelp, Droplets, Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { addOns, OFFICIAL, packageDetails, publishedPricing } from "@/lib/business-data";
import { assets } from "@/lib/assets";
import { formatUsd } from "@/lib/estimator";

export const metadata = {
  title: "Mobile Detailing Services | SHWASH",
  description: "Explore SHWASH interior, exterior, and combined mobile car detailing services, with verified inclusions and published add-ons.",
};

export default function ServicesPage() {
  return (
    <main>
      <section className="page-hero page-hero--services">
        <div className="container page-hero__inner">
          <div className="page-hero__copy"><p className="eyebrow">Thoughtful care, at your door</p><h1>A clean that fits your car and your day.</h1><p>Choose a focused interior detail or a full inside-and-out reset. SHWASH brings the equipment and supplies to your home, office, or apartment.</p><div className="button-row"><Link className="button button--primary" href="/assistant">Find my detailing service <ArrowRight size={16} /></Link><Link className="button button--light" href="/pricing">See transparent pricing</Link></div></div>
          <div className="page-hero__image"><Image src={assets.exterior.src} alt={assets.exterior.alt} fill loading="eager" sizes="(max-width: 850px) 100vw, 48vw" /></div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <SectionHeading eyebrow="Choose your service" title="A considered detail, inside and out." description="SHWASH keeps its core service menu simple. If you only need exterior work, choose it directly in the official booking flow; that price is not published on the pricing page." />
          <div className="service-feature-grid">
            <Reveal className="service-feature">
              <div className="service-feature__image"><Image src={assets.interior.src} alt={assets.interior.alt} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
              <div className="service-feature__content"><div className="service-feature__top"><span className="service-icon"><Sparkles size={18} /></span><span className="eyebrow">For a cabin reset</span></div><h3>{packageDetails.interior.name}</h3><p>{packageDetails.interior.description} A good fit when the cabin needs attention and the exterior can wait.</p><ul className="check-list">{packageDetails.interior.interior.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul><div className="service-feature__price"><span>One-time, from</span><strong>$199 <small>· coupe / sedan</small></strong></div><Link className="text-link" href="/pricing">Compare vehicle pricing <ArrowRight size={16} /></Link></div>
            </Reveal>
            <Reveal className="service-feature" delay={0.08}>
              <div className="service-feature__image"><Image src={assets.exterior.src} alt={assets.exterior.alt} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
              <div className="service-feature__content"><div className="service-feature__top"><span className="service-icon"><Droplets size={18} /></span><span className="eyebrow">For the full reset</span></div><h3>{packageDetails.full.name}</h3><p>{packageDetails.full.description} Choose it when you want the cabin refreshed and the paint cleaned and protected.</p><ul className="check-list">{[...packageDetails.full.interior.slice(0, 4), ...packageDetails.full.exterior.slice(0, 4)].map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul><div className="service-feature__price"><span>One-time, from</span><strong>$249 <small>· coupe / sedan</small></strong></div><Link className="text-link" href="/pricing">Compare vehicle pricing <ArrowRight size={16} /></Link></div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container service-exterior-callout">
          <div><p className="eyebrow">Prefer just the outside?</p><h2>Exterior-only detail</h2><p>SHWASH lists an exterior-only option in its official booking flow. The published marketing menu does not show a price, so confirm the service and total there.</p><a className="button button--primary" href={OFFICIAL.booking} target="_blank" rel="noreferrer">View official booking <ArrowUpRight size={16} /></a></div>
          <div className="service-exterior-callout__note"><CircleHelp size={19} /><span>SHWASH brings its own water and power setup; customers do not need to provide a hookup.</span></div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <SectionHeading eyebrow="Available add-ons" title="Extra attention, only where it helps." description="Add-ons are optional. Stain removal requires the matching shampoo treatment; let SHWASH know about unusually heavy buildup so they can confirm the scope." />
          <div className="addon-catalog">
            {addOns.map((item) => <article className="addon-catalog__item" key={item.id}><span className={`addon-catalog__mark addon-catalog__mark--${item.group}`}><Check size={15} /></span><div><h3>{item.label}</h3><p>{item.description}{item.fullDetailOnly ? " · Interior + exterior service required" : ""}</p></div><strong>${item.price}</strong></article>)}
          </div>
          <p className="catalog-disclaimer">Bio cleaning is specialized and should be confirmed with SHWASH before booking. SHWASH may confirm a different scope or an upfront condition-based adjustment for unusually heavy buildup.</p>
          <div className="centered-action"><Link className="button button--primary" href="/pricing">Build a price estimate <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="section section--dark service-plan-strip">
        <div className="container service-plan-strip__inner"><div><p className="eyebrow">For regular care</p><h2>Make clean a routine.</h2><p>Monthly, every two months, or quarterly. Service plans show a per-visit price, with a three-service minimum to keep the discounted rate.</p></div><div className="service-plan-strip__cars"><div><span>Coupe / Sedan · Monthly</span><strong>{formatUsd(publishedPricing.sedan.full.monthly)} <small>/ visit</small></strong></div><div><span>5-Seat SUV / Truck · Monthly</span><strong>{formatUsd(publishedPricing.suv5.full.monthly)} <small>/ visit</small></strong></div><div><span>7-Seat SUV / Van · Monthly</span><strong>{formatUsd(publishedPricing.suv7.full.monthly)} <small>/ visit</small></strong></div><Link className="button button--light" href="/pricing">Compare service plans <ArrowRight size={16} /></Link></div></div>
      </section>

      <section className="section section--white">
        <div className="container service-book-cta"><div><p className="eyebrow">Need a recommendation?</p><h2>We’ll help you choose the right starting point.</h2><p>Tell the SHWASH consultant about your vehicle and the areas you want to improve.</p></div><Link className="button button--primary" href="/assistant">Talk to the consultant <ArrowRight size={16} /></Link></div>
      </section>
    </main>
  );
}
