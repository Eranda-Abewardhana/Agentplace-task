import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, Clock3, Droplets, MapPin, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { DetailingCarousel } from "@/components/detailing-carousel";
import { HeroEntrance } from "@/components/hero-entrance";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { addOns, OFFICIAL, publishedPricing, vehicles } from "@/lib/business-data";
import { assets } from "@/lib/assets";
import { formatUsd } from "@/lib/estimator";

const trustItems = [
  { icon: MapPin, title: "We come to you", text: "Home, office, apartment, or parking garage" },
  { icon: Droplets, title: "No hookup needed", text: "SHWASH brings its own water and power" },
  { icon: ShieldCheck, title: "Trained and insured", text: "Professional detailers and a clear standard" },
  { icon: Star, title: "4.9 on Google", text: "A customer-rated Austin service" },
];

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <Image className="home-hero__photo" src={assets.hero.src} alt={assets.hero.alt} fill loading="eager" sizes="100vw" />
        <div className="home-hero__shade" />
        <div className="container home-hero__content">
          <HeroEntrance className="home-hero__copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Mobile detailing · Austin, Dallas &amp; Houston</p>
            <h1 data-hero-item>Make room for a <em>better drive.</em></h1>
            <p data-hero-item>Professional car detailing at home, work, or wherever your car is parked. SHWASH brings the detail to you.</p>
            <div className="button-row" data-hero-item><Link className="button button--primary" href="/assistant">Find My Detailing Service <ArrowRight size={16} /></Link><Link className="button button--outline-light" href="/services">Explore services</Link></div>
            <div className="home-hero__proof" data-hero-item><span><Check size={14} /> No water or power hookup</span><span><Check size={14} /> Transparent vehicle-size pricing</span></div>
          </HeroEntrance>
          <div className="home-hero__floating"><span className="home-hero__floating-icon"><Sparkles size={18} /></span><div><small>Interior + exterior from</small><strong>$249 <small>for a coupe / sedan</small></strong><Link href="/pricing">See all published pricing <ArrowUpRight size={13} /></Link></div></div>
          <a className="home-hero__scroll" href="#services"><span>Scroll to explore</span><ArrowDownRight size={15} /></a>
        </div>
      </section>

      <section className="trust-strip" aria-label="SHWASH service details"><div className="container trust-strip__grid">{trustItems.map(({ icon: Icon, title, text }) => <div className="trust-item" key={title}><Icon size={20} /><div><strong>{title}</strong><span>{text}</span></div></div>)}</div></section>

      <section id="services" className="section section--white">
        <div className="container">
          <div className="services-intro"><SectionHeading eyebrow="Details that fit" title="Two simple ways to refresh your car." description="Choose a deep interior clean, or let SHWASH take care of the cabin and exterior in one visit." /><Link className="text-link" href="/services">Explore every service <ArrowRight size={16} /></Link></div>
          <div className="home-service-grid">
            <Reveal className="home-service-card home-service-card--interior">
              <div className="home-service-card__art"><Image src={assets.interior.src} alt={assets.interior.alt} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
              <div className="home-service-card__body"><span className="service-index">01 / INTERIOR</span><h3>Reset the cabin.</h3><p>Steam cleaning, deep vacuuming, leather care, mats, glass, and the hard-to-reach areas.</p><div className="home-service-card__bottom"><strong>From $199</strong><Link href="/services" aria-label="Explore interior detailing">Explore <ArrowRight size={15} /></Link></div></div>
            </Reveal>
            <Reveal className="home-service-card home-service-card--full" delay={0.08}>
              <div className="home-service-card__art"><Image src={assets.exterior.src} alt={assets.exterior.alt} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>
              <div className="home-service-card__body"><span className="service-index">02 / INSIDE + OUT</span><h3>Bring back the shine.</h3><p>A complete cabin detail paired with a professional hand wash and high-gloss spray wax.</p><div className="home-service-card__bottom"><strong>From $249</strong><Link href="/services" aria-label="Explore interior and exterior detailing">Explore <ArrowRight size={15} /></Link></div></div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section--tint home-convenience">
        <div className="container home-convenience__grid">
          <Reveal className="home-convenience__photo"><Image src={assets.interior.src} alt={assets.interior.alt} fill sizes="(max-width: 850px) 100vw, 50vw" /><span className="photo-caption"><Truck size={15} /> The detail shop, wherever you are</span></Reveal>
          <div className="home-convenience__copy"><p className="eyebrow">Care on your schedule</p><h2>Your car stays right where you left it.</h2><p>At home, in the office lot, or at your apartment. SHWASH arrives with the water, power, products, and equipment for the job.</p><ul className="check-list check-list--large"><li><Check size={17} /> No drive across town or waiting room</li><li><Check size={17} /> No water or power hookup needed</li><li><Check size={17} /> A convenient visit while you work or stay home</li></ul><Link className="text-link" href="/assistant">Get a recommendation <ArrowRight size={16} /></Link></div>
        </div>
      </section>

      <section className="section section--white" id="how-it-works">
        <div className="container"><SectionHeading eyebrow="The SHWASH process" title="A detail in three easy steps." description="Straightforward choices, an at-location visit, and clear confirmation through SHWASH&apos;s official booking flow." align="center" /><div className="process-grid">
          <Reveal className="process-step"><span className="process-step__number">01</span><span className="process-step__icon"><Sparkles size={20} /></span><h3>Find the right service</h3><p>Compare packages and vehicle-size prices, or ask the consultant to guide you.</p><Link href="/assistant">Start a recommendation <ArrowRight size={15} /></Link></Reveal>
          <Reveal className="process-step" delay={0.08}><span className="process-step__number">02</span><span className="process-step__icon"><Clock3 size={20} /></span><h3>Choose a time with SHWASH</h3><p>Continue to the official booking site to enter your details and request a date.</p><a href={OFFICIAL.booking} target="_blank" rel="noreferrer">Open official booking <ArrowUpRight size={15} /></a></Reveal>
          <Reveal className="process-step" delay={0.16}><span className="process-step__number">03</span><span className="process-step__icon"><Truck size={20} /></span><h3>We come to your vehicle</h3><p>SHWASH brings its mobile setup to your home, work, apartment, or parking spot.</p><a href="https://www.shwash.co/locations/austin-tx" target="_blank" rel="noreferrer">Check Austin service area <ArrowUpRight size={15} /></a></Reveal>
        </div></div>
      </section>

      <section className="section section--navy home-pricing">
        <div className="container"><div className="home-pricing__top"><div><p className="eyebrow">Transparent by vehicle size</p><h2>Know the price before you choose.</h2><p>SHWASH publishes one-time prices and per-visit service-plan rates for each standard vehicle category.</p></div><Link className="button button--light" href="/pricing">Open the price estimator <ArrowRight size={16} /></Link></div>
          <div className="home-price-preview"><div className="home-price-preview__header"><span>Vehicle</span><span>Interior only</span><span>Interior + exterior</span></div>{vehicles.map((vehicle) => <div className="home-price-row" key={vehicle.id}><div className="home-price-row__vehicle"><Image src={vehicle.image} alt="" width={72} height={44} /><strong>{vehicle.label}</strong></div>{vehicle.id === "oversized" ? <><span>Call for quote</span><span>Call for quote</span></> : <><span>{formatUsd(publishedPricing[vehicle.id]["interior"]["one-time"])}</span><span className="home-price-row__featured">{formatUsd(publishedPricing[vehicle.id]["full"]["one-time"])}</span></>}</div>)}</div>
          <div className="home-plans-note"><div><span className="home-plans-note__icon"><Sparkles size={16} /></span><p><strong>Prefer regular upkeep?</strong> Monthly, every two months, or quarterly plans can save up to $100 per visit.</p></div><span>Three completed visits required for plan pricing.</span><Link href="/pricing">Compare plans <ArrowRight size={14} /></Link></div>
        </div>
      </section>

      <section className="section section--white home-showcase">
        <div className="container home-showcase__grid"><div><p className="eyebrow">The detail, up close</p><h2>Little details add up to a better-feeling drive.</h2><p>See the interior care, exterior hand wash, and mobile setup behind a convenient SHWASH visit.</p><Link className="text-link" href="/services">See what&apos;s included <ArrowRight size={15} /></Link><p className="home-showcase__photos-note"><Check size={14} /> Photos from SHWASH&apos;s own service pages.</p></div><DetailingCarousel /></div>
      </section>

      <section className="section section--tint home-why">
        <div className="container"><SectionHeading eyebrow="Why SHWASH" title="Reliable, professional care — brought to you." description="A mobile service built around consistent work, convenient visits, and clear communication." /><div className="why-grid"><article><span>01</span><h3>Convenience, built in</h3><p>Your vehicle can stay parked at home or work while SHWASH handles the detail.</p></article><article><span>02</span><h3>Trained professionals</h3><p>SHWASH describes a multi-week detailer training program and documented procedures.</p></article><article><span>03</span><h3>Clear scope and pricing</h3><p>Published prices vary by vehicle size, with optional add-ons itemized separately.</p></article><article><span>04</span><h3>Updates through the process</h3><p>SHWASH says customers receive booking confirmations, reminders, and service updates.</p></article></div></div>
      </section>

      <section className="section section--white home-addons">
        <div className="container home-addons__grid"><div><p className="eyebrow">A little extra care</p><h2>Target the things that need attention.</h2><p>Stubborn floor stains, pet hair, lingering odors, and child-seat cleaning are available as optional add-ons.</p><Link className="text-link" href="/services">Browse all add-ons <ArrowRight size={15} /></Link></div><div className="home-addons__list">{addOns.slice(0, 4).map((item) => <div key={item.id}><span>{item.label}</span><strong>+${item.price}</strong></div>)}</div></div>
      </section>

      <section className="section section--navy home-faq">
        <div className="container home-faq__grid"><div><p className="eyebrow">Good to know</p><h2>Questions, answered.</h2><p>Get clear on timing, utilities, pricing, and what actually confirms a booking.</p><Link className="text-link text-link--light" href="/services">Browse services <ArrowRight size={15} /></Link></div><div className="faq-list faq-list--dark">
          <details><summary>Do I need to provide water or power?</summary><p>No. SHWASH says it brings its own mobile setup, so no water or power hookup is needed.</p></details>
          <details><summary>Can SHWASH detail my car at work or an apartment?</summary><p>SHWASH lists homes, offices, apartments, and parking garages as service locations. Check access rules with your building manager if needed.</p></details>
          <details><summary>How long does a detail take?</summary><p>The Austin page estimates 1.5–2.5 hours for a combined detail and roughly 1–1.5 hours for interior-only work. Time varies by vehicle and condition.</p></details>
          <details><summary>When is payment collected?</summary><p>SHWASH says payment is processed after the service is completed to your satisfaction. This app does not collect payment.</p></details>
          <details><summary>Does this page book my appointment?</summary><p>No. This app prepares your service choices and sends you to SHWASH&apos;s official booking site. Only SHWASH can confirm your appointment.</p></details>
        </div></div>
      </section>

      <section className="final-cta"><div className="container final-cta__inner"><div><p className="eyebrow">A better detail starts here</p><h2>Let&apos;s find the right service for your car.</h2><p>Get a thoughtful recommendation in a few quick questions.</p></div><Link className="button button--primary" href="/assistant">Find My Detailing Service <ArrowRight size={16} /></Link></div></section>
    </main>
  );
}
